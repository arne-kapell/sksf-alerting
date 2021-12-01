import express, { json, NextFunction, Request, Response } from "express";
import { Server, Socket } from "socket.io";
import { hash, compare } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import * as portUsed from "tcp-port-used";
import * as m from "../db/models";
import axios, { AxiosBasicCredentials, AxiosError } from "axios";
const app = express();
let io: Server | null = null;

app.use(json());
app.all("/tinf20cs1", (req, res) => {
	res.json({ secret: "SECURITY!!!" });
});

// Sync database
const syncOptions = {
	alter: process.env.NODE_ENV === "development"
};
m.User.sync(syncOptions);
m.Action.sync(syncOptions);
m.Checklist.sync(syncOptions);
m.Alarm.sync(syncOptions);
m.ChecklistAction.sync(syncOptions);

// Authentication middlewares
const tokenSecret = process.env.JWT_SECRET || "secret_sks-f";
const auth: (token: string) => Promise<boolean | User> = async (token) => {
	try {
		const decoded = verify(token, tokenSecret) as { uid: number, mail: string, name: string, privileged: boolean };
		const user = await m.User.findByPk(decoded.uid);
		if (user) {
			return {
				uid: user.get("uid"),
				mail: user.get("mail"),
				name: user.get("name"),
				privileged: user.get("privileged")
			} as User;
		} else {
			return false;
		}
	} catch (e) {
		return false;
	}		
};
const expressAuth = async (req: Request, res: Response, next: NextFunction) => {
	const { authorization } = req.headers;
	if (authorization && authorization.split(" ")[0] === "Bearer" && authorization.split(" ")[1]) {
		const token = authorization.split(" ")[1];
		const user = await auth(token);
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
const socketAuth = async (socket: Socket, next: (err?: Error) => void) => {
	const { authorization } = socket.handshake.headers;
	if (authorization && authorization.split(" ")[0] === "Bearer" && authorization.split(" ")[1]) {
		const token = authorization.split(" ")[1];
		const user = await auth(token);
		if (user) {
			next();
		} else {
			next(new Error("Invalid token"));
		}
	} else {
		next(new Error("No token provided"));
	}
};

app.use(async (req, res, next) => {
	if (!io) {
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
	const user = await m.User.findOne({ where: { mail } });
	const isValid = user && await compare(password, user.get("pwdHash"));
	if (isValid) {
		res.json({
			token: sign({
				uid: user?.get("uid"),
				name: user?.get("name"),
				mail: user?.get("mail"),
				privileged: user?.get("privileged"),
			}, tokenSecret, { expiresIn: "1h" })
		});
	} else {
		res.status(401).json({ error: (!user) ? "Unknown mail" : "Invalid password" });
	}
});

app.post("/register", async (req, res) => {
	const { mail, password, name } = req.body;
	const user = await m.User.findOne({ where: { mail } });
	if (user) {
		res.status(400).json({ error: "Mail already in use" });
	} else {
		const hashedPwd = await hash(password, 10);
		const newUser = await m.User.create({
			mail,
			name,
			pwdHash: hashedPwd,
			privileged: false
		});
		res.json({
			token: sign({
				uid: newUser?.get("uid"),
				name: newUser?.get("name"),
				mail: newUser?.get("mail"),
				privileged: newUser?.get("privileged"),
			}, tokenSecret, { expiresIn: "1h" })
		});
	}
});

app.get("/user-info", expressAuth, async (req, res) => {
	const user = res.locals.user as User;
	res.json({
		user: {
			uid: user.uid,
			name: user.name,
			mail: user.mail,
			privileged: user.privileged
		}
	});
});

// Helper function to notify ui via socket.io and passengers via information system api about new alarms
const notify = async (alarm: Alarm) => {
	io?.emit("alarm");
	try {
		await axios.post("http://asm.fl.dlr.de:10001/terminal", {
			messages: [
				{
					level: "info",
					message: alarm.message
				}
			]
		}, {
			auth: {
				username: "tinf19cs",
				password: "$sse1%8Dh2bw"
			} as AxiosBasicCredentials
		});
	} catch (e) {
		console.error("Error sending alarm to 'Passagier Informationssystem':", (e as AxiosError).response?.status);
	}
};

// Realtime alarm endpoint
app.post("/realtime-alarm", async (req, res) => {
	const mapAlarm = (a: Alarm) => {
		return {
			risk: a.risk,
			source: a.source,
			message: a.message,
			checklistId: a.checklistId
		} as m.AlarmInput;
	};
	
	const { alarm } = req.body;
	const existing = await m.Alarm.findOne({ where: { uid: alarm.uid } });
	let uid: number | boolean = false;
	if (existing) {
		uid = (await existing.update(mapAlarm(alarm))).get("uid");
	} else {
		uid = (await m.Alarm.create(mapAlarm(alarm))).get("uid");
	}
	res.json({ success: true, uid: uid });
	notify(alarm);
});

// Alarm endpoint for ui
app.get("/alarms", expressAuth, async (req, res) => {
	const alarms = await m.Alarm.findAll({
		order: [["updatedAt", "DESC"]],
		limit: 100
	});
	console.log(alarms);
	res.json({
		alarms: alarms.map((a) => ({
			uid: a.get("uid"),
			risk: a.get("risk"),
			source: a.get("source"),
			message: a.get("message"),
			checklistId: a.get("checklistId"),
			datetime: a.get("updatedAt")
		}))
	});
});

// Endpoint for high-level passenger information
app.get("/passenger/information", async (req, res) => {
	const alarms = await m.Alarm.findAll({
		order: [["updatedAt", "DESC"]],
		limit: 100
	}) as m.AlarmSourceChecklist[];
	res.json({
		count: alarms.length,
		alarms: alarms.map(a => {
			const date = new Date(a.get("updatedAt"));
			const diff = Math.abs(date.getTime() - new Date().getTime());
			const diffMinutes = Math.floor((diff / 1000) / 60);
			return {
				since: (diffMinutes > 0) ? diffMinutes + " minutes" : "just now",
				risk: a.get("risk"),
				system: a.get("source")
			};
		})
	});
});

module.exports = app;