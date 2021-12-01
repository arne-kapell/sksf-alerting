import { DataTypes, Model, Optional } from "sequelize";
import db from "../db";

interface UserAttributes {
	uid: number;
	name: string;
	mail: string;
	pwdHash: string;
	privileged: boolean;

	createdAt?: Date;
	updatedAt?: Date;
}
export type UserInput = Optional<UserAttributes, "uid" | "name" | "mail" | "pwdHash" | "privileged">
export type UserOuput = Required<UserAttributes>
export class User extends Model<UserAttributes, UserInput> implements UserAttributes {
	uid!: number;
	name!: string;
	mail!: string;
	pwdHash!: string;
	privileged!: boolean;

	createdAt!: Date;
	updatedAt!: Date;
}
User.init({
	uid: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	name: {
		type: DataTypes.STRING
	},
	mail: {
		type: DataTypes.STRING
	},
	pwdHash: {
		type: DataTypes.STRING
	},
	privileged: {
		type: DataTypes.BOOLEAN
	}
}, {
	timestamps: true,
	sequelize: db
});

interface ActionAttributes {
	uid: number;
	content: string;

	createdAt?: Date;
	updatedAt?: Date;
}
export type ActionInput = Optional<ActionAttributes, "content">
export type ActionOuput = Required<ActionAttributes>
export class Action extends Model<ActionAttributes, ActionInput> implements ActionAttributes {
	uid!: number;
	content!: string;

	createdAt!: Date;
	updatedAt!: Date;
}
Action.init({
	uid: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	content: {
		type: DataTypes.STRING
	}
}, {
	timestamps: true,
	sequelize: db
});

interface ChecklistAttributes {
	uid: number;
	name: string;
	category: string;
	actionIds: string;
	progress: number;

	createdAt?: Date;
	updatedAt?: Date;
}
export type ChecklistInput = Optional<ChecklistAttributes, "name" | "category" | "actionIds" | "progress">
export type ChecklistOuput = Required<ChecklistAttributes>
export class Checklist extends Model<ChecklistAttributes, ChecklistInput> implements ChecklistAttributes {
	uid!: number;
	name!: string;
	category!: string;
	actionIds!: string;
	progress!: number;

	createdAt!: Date;
	updatedAt!: Date;
}
Checklist.init({
	uid: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	name: {
		type: DataTypes.STRING
	},
	category: {
		type: DataTypes.STRING
	},
	actionIds: {
		type: DataTypes.STRING
	},
	progress: {
		type: DataTypes.INTEGER
	}
}, {
	timestamps: true,
	sequelize: db
});

interface AlarmAttributes {
	uid: number;
	category: string;
	checklistId: number;
	source: string;
	risk: number;
	active: boolean;

	createdAt?: Date;
	updatedAt?: Date;
}
export type AlarmInput = Optional<AlarmAttributes, "category" | "checklistId" | "source" | "risk" | "active">
export type AlarmOuput = Required<AlarmAttributes>
export class Alarm extends Model<AlarmAttributes, AlarmInput> implements AlarmAttributes {
	uid!: number;
	category!: string;
	checklistId!: number;
	source!: string;
	risk!: number;
	active!: boolean;

	createdAt!: Date;
	updatedAt!: Date;
}
Alarm.init({
	uid: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	category: {
		type: DataTypes.STRING
	},
	risk: {
		type: DataTypes.INTEGER
	},
	source: {
		type: DataTypes.STRING
	},
	checklistId: {
		type: DataTypes.INTEGER
	},
	active: {
		type: DataTypes.BOOLEAN,
		defaultValue: true
	}
}, {
	timestamps: true,
	sequelize: db
});

// Relations
Alarm.belongsTo(Checklist, {
	foreignKey: "checklistId"
});
Checklist.hasMany(Alarm, {
	foreignKey: "checklistId"
});
export type AlarmSourceChecklist = Required<Alarm> & Required<Checklist>;