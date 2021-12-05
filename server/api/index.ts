import express, { json, NextFunction, Request, Response } from "express";
import { Server, Socket } from "socket.io";
import { hash, compare } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import * as portUsed from "tcp-port-used";
import axios, { AxiosBasicCredentials, AxiosError } from "axios";
import db from "../db";
import { Action, Alarm, Checklist, ChecklistAction, User } from "../db/models";
import { asyncForEach } from "./helpers";
const app = express();
let io: Server | null = null;

// Sync database
const syncOptions = {
	// force: true,
	alter: process.env.NODE_ENV === "development"
};
db.modelManager.addModel(Action);
db.modelManager.addModel(Alarm);
db.modelManager.addModel(Checklist);
db.modelManager.addModel(ChecklistAction);
db.modelManager.addModel(User);
db.sync(syncOptions);

app.use(json());

// Authentication middlewares
const tokenSecret = process.env.JWT_SECRET || "secret_sks-f";
const auth: (token: string) => Promise<boolean | User> = async (token) => {
	try {
		const decoded = verify(token, tokenSecret) as { uid: number, mail: string, name: string, privileged: boolean };
		const user = await User.findByPk(decoded.uid);
		if (user) {
			return {
				uid: user.uid,
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

// Middleware for starting socket.io server
app.use(async (req: Request, res: Response, next: NextFunction) => {
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
app.post("/login", async (req: Request, res: Response) => {
	const { mail, password } = req.body;
	const user = await User.findOne({ where: { mail } });
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
app.post("/register", expressAuth, async (req: Request, res: Response) => {
	const { mail, password, name, privileged } = req.body;
	const currentUser = res.locals.user as User;
	if (currentUser.privileged) {
		const user = await User.findOne({ where: { mail } });
		if (user) {
			res.status(400).json({ error: "Mail already in use" });
		} else {
			const saltRounds = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
			const hashedPwd = await hash(password, saltRounds);
			const newUser = await User.create({
				mail,
				name,
				pwdHash: hashedPwd,
				privileged: (privileged) || false
			});
			res.json({ success: true, uid: newUser.uid });
		}
	} else {
		res.status(401).json({ error: "User not permitted" });
	}
});
app.get("/user-info", expressAuth, async (req: Request, res: Response) => {
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
		await axios.post("http://asm.fl.dlr.de:10001/terminal", [{
			level: (alarm.risk <= 50) ? "info" : "warning",
			message: alarm.message
		}], {
			withCredentials: true,
			auth: {
				username: "tinf19cs",
				password: process.env.API_PASSWORD
			} as AxiosBasicCredentials
		});
	} catch (e) {
		console.error("Error sending alarm to 'Passagier Informationssystem':", (e as AxiosError).response?.status);
	}
};

// Realtime alarm endpoint for analysis modules
app.post("/realtime-alarm", async (req: Request, res: Response) => {
	const { alarm } = req.body;
	let uid: number | boolean = false;
	if (alarm.uid) {
		const existing = await Alarm.findOne({ where: { uid: alarm.uid } });
		if (existing) {
			uid = (await existing.update(alarm)).get("uid");
		} else {
			uid = (await Alarm.create(alarm)).uid;
		}
	} else {
		uid = (await Alarm.create(alarm)).uid;
	}
	const inDb = await Alarm.findByPk(uid);
	const checklist = await Checklist.findOne({ where: { source: inDb.get("source") } });
	if (checklist) {
		const checklistId = checklist.get("uid");
		inDb.set({
			checklistId
		});
	}
	const final = await inDb.save();
	res.json({ success: true, uid: (final.uid) | final.get("uid"), checklistId: final.get("checklistId") });
	notify(alarm);
});

// Endpoint for setting progress on alarms
app.put("/alarms/progress", expressAuth, async (req: Request, res: Response) => {
	const { uid, progress } = req.body;
	const alarm = await Alarm.findOne({ where: { uid } });
	if (alarm) {
		alarm.set({ progress });
		const final = await alarm.save();
		res.json({ success: true, uid: final.get("uid"), progress: final.get("progress") });
	} else {
		res.status(404).json({ error: "Alarm not found" });
	}
});

// Alarm endpoint for ui
app.get("/alarms/:limit", expressAuth, async (req: Request, res: Response) => {
	const { limit } = req.params;
	const alarms = await Alarm.findAll({
		order: [["uid", "ASC"]],
		limit: limit ? Number(limit) : 10,
	});
	res.json({
		alarms: alarms.map((a: Alarm) => ({
			uid: a.get("uid"),
			risk: a.get("risk"),
			api: a.get("api"),
			source: a.get("source"),
			message: a.get("message"),
			checklistId: a.get("checklistId"),
			progress: a.get("progress"),
			datetime: a.get("updatedAt")
		}))
	});
});

// Endpoint for high-level passenger information
app.get("/passenger/information", async (req: Request, res: Response) => {
	const alarms = await Alarm.findAll({
		order: [["updatedAt", "DESC"]],
		limit: 100
	});
	res.json({
		count: alarms?.length,
		alarms: alarms?.map((a: Alarm) => {
			const date = new Date(a.get("updatedAt"));
			const diff = Math.abs(date.getTime() - new Date().getTime());
			const diffMinutes = Math.floor((diff / 1000) / 60);
			return {
				since: (diffMinutes > 0) ? diffMinutes + " minutes ago" : "just now",
				risk: a.get("risk"),
				system: a.get("api")
			};
		})
	});
});

// Endpoints for checklist management
app.get("/checklist/:uid", expressAuth, async (req: Request, res: Response) => {
	const cUid = Number(req.params.uid);
	const checklist = await Checklist.findByPk(cUid, {
		include: [{ model: Action, as: "Actions" }]
	});
	if (!checklist) {
		res.status(404).json({ error: "Checklist not found" });
	} else {
		res.json({
			uid: checklist.get("uid"),
			name: checklist.get("name"),
			source: checklist.get("source"),
			actions: checklist.get("Actions").map((a: Action) => ({
				uid: a.get("uid"),
				name: a.get("name"),
				function: a.get("function"),
				responsiblePerson: a.get("responsiblePerson"),
				info: a.get("info")
			}))
		});
	}
});
app.post("/checklist", expressAuth, async (req: Request, res: Response) => {
	const { name, source, actions } = req.body;
	await asyncForEach(actions, async (a: ActionType, i: number) => {
		if (!a.uid) {
			actions[i] = await Action.create({
				name: a.name,
				function: a.function,
				responsiblePerson: a.responsiblePerson,
				info: a.info
			});
		} else {
			actions[i] = await Action.findByPk(a.uid);
		}
	});
	const checklist = await Checklist.create({
		name,
		source,
		Actions: actions
	}, {
		include: [ { model: Action, as: "Actions" } ]
	});
	await asyncForEach(actions, async (a: Action) => {
		await ChecklistAction.create({
			checklistId: checklist.uid,
			actionId: a.uid
		});
	});
	const final = await Checklist.findByPk(checklist.uid, {
		include: [ { model: Action, as: "Actions" } ]
	});
	res.json({
		success: true,
		checklist: {
			uid: final?.get("uid"),
			name: final?.get("name"),
			source: final?.get("source"),
			actions: final?.get("Actions").map((a: Action) => ({
				uid: a.get("uid"),
				name: a.get("name"),
				function: a.get("function"),
				responsiblePerson: a.get("responsiblePerson"),
				info: a.get("info")
			}))
		}
	});
});
app.put("/checklist/:uid", expressAuth, async (req: Request, res: Response) => {
	const cUid = Number(req.params.uid);
	const { name, source, actions } = req.body;
	const checklist = await Checklist.findByPk(cUid, {
		include: [ { model: Action, as: "Actions" } ]
	});
	if (!checklist) {
		res.status(404).json({ error: "Checklist not found" });
	} else {
		await asyncForEach(actions, async (a: ActionType, i: number) => {
			if (!a.uid) {
				actions[i] = await Action.create({
					name: a.name,
					function: a.function,
					responsiblePerson: a.responsiblePerson,
					info: a.info
				});
			} else {
				actions[i] = await Action.findByPk(a.uid);
			}
		});
		await checklist.update({
			name,
			source
		});
		const relations = await ChecklistAction.findAll({ where: { checklistId: cUid } });
		const relationsToDelete = relations.filter((r: ChecklistAction) => actions.map((a: Action) => a.get("uid")).indexOf(r.actionId) === -1);
		await asyncForEach(relationsToDelete, async (r: ChecklistAction) => await r.destroy());
		const relationsToCreate = actions.filter((a: Action) => relations.map((r: ChecklistAction) => r.get("actionId")).indexOf(a.uid) === -1);
		await asyncForEach(relationsToCreate, async (a: Action) => {
			await ChecklistAction.create({
				checklistId: cUid,
				actionId: a.get("uid")
			});
		});
		const final = await Checklist.findByPk(checklist.get("uid"), {
			include: [ { model: Action, as: "Actions" } ]
		});
		res.json({
			success: true,
			checklist: {
				uid: final?.get("uid"),
				name: final?.get("name"),
				source: final?.get("source"),
				actions: final?.get("Actions").map((a: Action) => ({
					uid: a.get("uid"),
					name: a.get("name"),
					function: a.get("function"),
					responsiblePerson: a.get("responsiblePerson"),
					info: a.get("info")
				}))
			}
		});
	}
});
app.delete("/checklist/:uid", expressAuth, async (req: Request, res: Response) => {
	const cUid = Number(req.params.uid);
	const checklist = await Checklist.findByPk(cUid);
	console.log(checklist);
	if (!checklist) {
		res.status(404).json({ error: "Checklist not found" });
	} else {
		await checklist.destroy();
		res.json({ success: true });
	}
});

// Endpoint for action query
app.get("/actions/:limit", expressAuth, async (req: Request, res: Response) => {
	const { limit } = req.params;
	const actions = await Action.findAll({
		order: [["updatedAt", "DESC"]],
		limit: limit ? Number(limit) : 10
	});
	res.json({
		actions: actions.map((a: Action) => ({
			uid: a.get("uid"),
			name: a.get("name"),
			function: a.get("function"),
			responsiblePerson: a.get("responsiblePerson"),
			info: a.get("info")
		}))
	});
});

module.exports = app;