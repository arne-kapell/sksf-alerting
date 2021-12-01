import * as dbConfig from "./db.config";
import { Dialect, Sequelize } from "sequelize";

const db = new Sequelize(dbConfig.DB as string, dbConfig.USER as string, dbConfig.PASSWORD, {
	host: dbConfig.HOST,
	dialect: dbConfig.dialect as Dialect,
	operatorsAliases: undefined,
	pool: dbConfig.pool,
	logging: false
});

export default db;