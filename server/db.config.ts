const HOST = "195.62.33.39";
const USER = "ui";
const PASSWORD = process.env.DB_PASSWORD || "";
const DB = "ui";
const dialect = "postgres";
const pool = {
	max: 5,
	min: 0,
	acquire: 30000,
	idle: 10000
};
export {
	HOST,
	USER,
	PASSWORD,
	DB,
	dialect,
	pool
};