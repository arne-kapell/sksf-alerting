import express, { json } from "express";
import { hash, compare } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
const app = express();

app.use(json());
app.all("/tinf20cs1", (req, res) => {
	res.json({ data: "SECURITY!!!" });
});

// Authentication endpoints
const userDB: User[] = [
	// {
	// 	uid: "test",
	// 	groupId: 0,
	// 	mail: "test@test.de",
	// 	pwdHash: "testpw"
	// }
];
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
app.get("/user-info", async (req, res) => {
	const { authorization } = req.headers;
	if (authorization && authorization.split(" ")[0] === "Bearer" && authorization.split(" ")[1]) {
		const token = authorization.split(" ")[1];
		try {
			const decoded = verify(token, "secret") as { uid: number, mail: string, groupId: number };
			const user = userDB.find(u => u.uid == decoded.uid);
			if (user) {
				res.json({
					user: {
						uid: user.uid,
						name: user.name,
						groupId: user.groupId,
						mail: user.mail
					}
				});
			} else {
				res.status(401).json({ error: "Invalid token" });
			}
		} catch (e) {
			res.status(401).json({ error: "Invalid token" });
		}
	} else {
		res.status(401).json({ error: "No token provided" });
	}
});


module.exports = app;