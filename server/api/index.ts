import express, { json, NextFunction, Request, Response } from "express";
import { Server, Socket } from "socket.io";
import { hash, compare } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import * as portUsed from "tcp-port-used";
import * as m from "../db/models";
const app = express();
let io: Server | null = null;

app.use(json());
app.all("/tinf20cs1", (req, res) => {
	res.json({ secret: "SECURITY!!!" });
});

// sync database
const syncOptions = {
	alter: process.env.NODE_ENV === "development"
};
m.User.sync(syncOptions);
m.Action.sync(syncOptions);
m.Checklist.sync(syncOptions);
m.Alarm.sync(syncOptions);

// Authentication middlewares
const tokenSecret = process.env.JWT_SECRET || "secret_sks-f";
const auth: (token: string) => Promise<boolean | User> = async (token) => {
	try {
		const decoded = verify(token, tokenSecret) as { uid: number, mail: string, name: string, privileged: boolean };
		const user = await m.User.findByPk(decoded.uid);
		if (user) {
			return {
				uid: user.uid,
				mail: user.mail,
				name: user.name,
				privileged: user.privileged
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
	const isValid = user && await compare(password, user.pwdHash);
	if (isValid) {
		res.json({
			token: sign({
				uid: user?.uid,
				name: user?.name,
				mail: user?.mail,
				privileged: user?.privileged,
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
				uid: newUser.uid,
				name: newUser.name,
				mail: newUser.mail,
				privileged: newUser.privileged,
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

// realtime alarm endpoint
app.post("/realtime-alarm", async (req, res) => {
	const mapAlarm = (a: Alarm) => {
		return {
			uid: a.uid,
			category: a.category,
			risk: a.risk,
			source: a.source,
			checklistId: a.checklist?.uid,
		};
	};
	
	const { alarm } = req.body;
	const existing = await m.Alarm.findOne({ where: { uid: alarm.uid } }) as m.AlarmSourceChecklist;
	if (existing) {
		console.log();
		// existing.update(mapAlarm(existing));
	} else {
		if (alarm.checklist) {
			const checklist = await m.Checklist.findOrCreate({ where: { uid: alarm.checklist.uid } }) as unknown as m.Checklist;
			checklist.update(alarm.checklist as Checklist);
		}

		m.Alarm.create(mapAlarm(alarm));
	}
	io?.emit("alarm");
	res.json({ success: true });
});

// alarm endpoint for ui
app.get("/alarms", expressAuth, async (req, res) => {
	const alarms = await m.Alarm.findAll({
		order: [["datetime", "DESC"]],
		limit: 100
	});
	res.json({
		alarms: alarms
	});
});

// endpoint for high-level passenger information
app.get("/passenger/information", async (req, res) => {
	const alarms = await m.Alarm.findAll({
		order: [["datetime", "DESC"]],
		limit: 100
	}) as m.AlarmSourceChecklist[];
	res.json({
		count: alarms.length,
		alarms: alarms.map(a => {
			const date = new Date(a.updatedAt);
			const diff = Math.abs(date.getTime() - new Date().getTime());
			const diffMinutes = Math.floor((diff / 1000) / 60);
			return {
				since: (diffMinutes > 0) ? diffMinutes + " minutes" : "just now",
				risk: a.risk,
				system: a.name
			};
		})
	});
});

module.exports = app;