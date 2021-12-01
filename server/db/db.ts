import * as dbConfig from "./db.config";
import { Dialect, Sequelize } from "sequelize";

const db = new Sequelize(dbConfig.DB as string, dbConfig.USER as string, dbConfig.PASSWORD, {
	host: dbConfig.HOST,
	dialect: dbConfig.dialect as Dialect,
	operatorsAliases: undefined,
	pool: dbConfig.pool,
	logging: false
});

// const db = {
// 	Sequelize: Sequelize,
// 	sequelize: seq,
// 	role: models.role(seq, Sequelize),
// 	user: models.user(seq, Sequelize),
// 	action: models.action(seq, Sequelize),
// 	source: models.source(seq, Sequelize),
// 	checklist: models.checklist(seq, Sequelize),
// 	alarm: models.alarm(seq, Sequelize)
// };


export default db;