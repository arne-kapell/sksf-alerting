import express, { json, NextFunction, Request, Response } from "express";
import { Server, Socket } from "socket.io";
import { hash, compare } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import * as portUsed from "tcp-port-used";
const app = express();
let io: Server | null = null;

app.use(json());
app.all("/tinf20cs1", (req, res) => {
	res.json({ secret: "SECURITY!!!" });
});

// temporary user database
const userDB: User[] = [
	// {
	// 	uid: "test",
	// 	groupId: 0,
	// 	mail: "test@test.de",
	// 	pwdHash: "testpw"
	// }
];

// temporary alarm database
const alarmDB: Alarm[] = [
	{
		uid: "0",
		category: "ddos" as AlarmCategory,
		datetime: new Date(),
		risk: "high" as Risk,
		source: {
			uid: "0",
			name: "testserver"
		}
	}
];

import db from "../models";
db.sequelize.sync();

// Authentication middlewares
const auth: (token: string) => boolean | User = (token) => {
	try {
		const decoded = verify(token, "secret") as { uid: number, mail: string, groupId: number };
		const user = userDB.find(u => u.uid == decoded.uid);
		if (user) {
			return user;
		} else {
			return false;
		}
	} catch (e) {
		return false;
	}		
};
const expressAuth = (req: Request, res: Response, next: NextFunction) => {
	const { authorization } = req.headers;
	if (authorization && authorization.split(" ")[0] === "Bearer" && authorization.split(" ")[1]) {
		const token = authorization.split(" ")[1];
		const user = auth(token);
		if (user) {
			res.locals.user = user;
			next();				
		} else {
			res.status(401).json({ error: "Invalid token" });
		}
	} else {
		res.status(401).json({ error: "No token provided" });
	}
};
const socketAuth = (socket: Socket, next: (err?: Error) => void) => {
	const { authorization } = socket.handshake.headers;
	if (authorization && authorization.split(" ")[0] === "Bearer" && authorization.split(" ")[1]) {
		const token = authorization.split(" ")[1];
		const user = auth(token);
		if (user) {
			next();
		} else {
			next(new Error("Invalid token"));
		}
	} else {
		next(new Error("No token provided"));
	}
};

import * as dbConfig from "../db.config";
app.use(async (req, res, next) => {
	if (!io) {
		console.log(dbConfig.PASSWORD.length);
		const running = await portUsed.check(3001);
		if (running) {
			console.warn("Socket.io server already running, if in development mode please restart nuxt!");
		} else {
			io = new Server(3001, {
				cors: {
					origin: "http://localhost:3000",
					methods: ["GET", "POST"]
				}
			});
			// console.log(io.httpServer);
			io.path("/socket.io");
			console.info("Started socket.io server");
		
			io.use(socketAuth);
		
			io.on("connection", async (socket) => {
				socket.join("alarms");
				console.log("Client connected | sockets:", await io?.allSockets());
				socket.on("disconnect", async () => {
					console.log("Client disconnected | sockets:", await io?.allSockets());
				});
			});
		}
	}
	next();
});


// Authentication endpoints
app.post("/login", async (req, res) => {
	const { mail, password } = req.body;
	const user = userDB.find(u => u.mail === mail);
	const isValid = user && await compare(password, user.pwdHash);
	if (isValid) {
		res.json({
			token: sign({
				uid: user?.uid,
				mail: user?.mail,
				groupId: user?.groupId
			}, "secret", { expiresIn: "1h" })
		});
	} else {
		res.status(401).json({ error: (!user) ? "Unknown mail" : "Invalid password" });
	}
});

app.post("/register", async (req, res) => {
	const { mail, password, name } = req.body;
	const user = userDB.find(u => u.mail === mail);
	if (user) {
		res.status(400).json({ error: "Mail already in use" });
	} else {
		const hashedPwd = await hash(password, 10);
		const uid = (userDB.length >= 1) ? userDB[userDB.length - 1].uid + 1 : 0;
		userDB.push({
			uid: uid,
			name: name,
			groupId: 0,
			mail: mail,
			pwdHash: hashedPwd
		});
		res.json({
			token: sign({
				uid: uid,
				mail: mail,
				groupId: 0
			}, "secret", { expiresIn: "1h" })
		});
	}
});

app.get("/user-info", expressAuth, async (req, res) => {
	const user = res.locals.user;
	res.json({
		user: {
			uid: user.uid,
			name: user.name,
			groupId: user.groupId,
			mail: user.mail
		}
	});
});

// realtime alarm endpoint
app.post("/realtime-alarm", async (req, res) => {
	const { alarm } = req.body;
	const existing = alarmDB.find(a => a.uid === alarm.uid);
	const mapAlarm = (a: Alarm) => {
		const date = new Date(a.datetime);
		return {
			uid: a.uid,
			category: a.category as AlarmCategory,
			datetime: date,
			risk: a.risk as Risk,
			source: a.source as Source
		};
	};
	if (existing) {
		alarmDB.splice(alarmDB.indexOf(existing), 1, mapAlarm(alarm));
	} else {
		alarmDB.push(mapAlarm(alarm));
	}
	io?.emit("alarm");
	res.json({ success: true });
});

// alarm endpoint for ui
app.get("/alarms", expressAuth, async (req, res) => {
	res.json({
		alarms: alarmDB
	});
});

// endpoint for high-level passenger information
app.get("/passenger/information", (req, res) => {
	res.json({
		count: alarmDB.length,
		alarms: alarmDB.map(a => {
			const date = new Date(a.datetime);
			const diff = Math.abs(date.getTime() - new Date().getTime());
			const diffMinutes = Math.floor((diff / 1000) / 60);
			return {
				since: (diffMinutes > 0) ? diffMinutes + " minutes" : "just now",
				risk: a.risk,
				system: a.source.name
			};
		})
	});
});

module.exports = app;