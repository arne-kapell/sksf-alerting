import * as dbConfig from "../db.config";
import { Sequelize } from "sequelize";

const seq = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
	host: dbConfig.HOST,
	dialect: dbConfig.dialect,
	operatorsAliases: undefined,

	pool: dbConfig.pool
});

const db = {
	Sequelize: Sequelize,
	sequelize: seq,
	// models: require("./tutorial.model.js")(sequelize, Sequelize)
};


export default db;