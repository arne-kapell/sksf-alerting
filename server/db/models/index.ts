import { DataTypes, Model, Optional } from "sequelize";
import db from "..";

interface ActionAttributes {
	uid?: number;
	name: string;
	function: string;
	responsiblePerson?: string;
	info?: string;

	createdAt?: Date;
	updatedAt?: Date;
}
export type ActionInput = Optional<ActionAttributes, "responsiblePerson" | "info">
export type ActionOuput = Required<ActionAttributes>
export class Action extends Model<ActionAttributes, ActionInput> implements ActionAttributes {
	uid!: number;
	name!: string;
	function!: string;
	responsiblePerson!: string;
	info!: string;

	createdAt!: Date;
	updatedAt!: Date;
}
Action.init({
	uid: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	function: {
		type: DataTypes.STRING,
		allowNull: false
	},
	info: {
		type: DataTypes.STRING
	}
}, {
	timestamps: true,
	sequelize: db
});

interface AlarmAttributes {
	uid: number;
	api: string;
	source: string;
	message: string;
	risk: number;

	checklistId: number;

	progress: number;

	createdAt?: Date;
	updatedAt?: Date;
}
export type AlarmInput = Optional<AlarmAttributes, "uid" | "checklistId" | "source" | "risk" | "message" | "progress">
export type AlarmOuput = Required<AlarmAttributes>
export class Alarm extends Model<AlarmAttributes, AlarmInput> implements AlarmAttributes {
	uid!: number;
	api!: string;
	source!: string;
	message!: string;
	risk!: number;

	checklistId!: number;

	progress!: number;

	createdAt!: Date;
	updatedAt!: Date;
}
Alarm.init({
	uid: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	api: {
		type: DataTypes.STRING
	},
	source: {
		type: DataTypes.STRING
	},
	message: {
		type: DataTypes.STRING
	},
	risk: {
		type: DataTypes.INTEGER,
		defaultValue: 0
	},

	checklistId: {
		type: DataTypes.INTEGER,
		references: {
			model: "Checklists",
			key: "uid"
		}
	},

	progress: {
		type: DataTypes.INTEGER,
		defaultValue: 0
	}
}, {
	timestamps: true,
	sequelize: db
});

interface ChecklistAttributes {
	uid?: number;
	name: string;
	source: string;

	Actions?: Action[];

	createdAt?: Date;
	updatedAt?: Date;
}
export type ChecklistInput = Optional<ChecklistAttributes, "uid" | "name" | "source" | "Actions">
export type ChecklistOuput = Required<ChecklistAttributes>
export class Checklist extends Model<ChecklistAttributes, ChecklistInput> implements ChecklistAttributes {
	uid!: number;
	name!: string;
	source!: string;

	Actions!: Action[];

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
	source: {
		type: DataTypes.STRING
	}
}, {
	timestamps: true,
	sequelize: db
});

interface ChecklistActionAttributes {
	checklistId: number;
	actionId: number;
}
export type ChecklistActionInput = Required<ChecklistActionAttributes>
export type ChecklistActionOuput = Required<ChecklistActionAttributes>
export class ChecklistAction extends Model<ChecklistActionAttributes, ChecklistActionInput> implements ChecklistActionAttributes {
	checklistId!: number;
	actionId!: number;
}
ChecklistAction.init({
	checklistId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: "Checklists",
			key: "uid"
		}	
	},
	actionId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: "Actions",
			key: "uid"
		}
	}
}, {
	timestamps: false,
	sequelize: db
});
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

// Relations
Alarm.belongsTo(Checklist, {
	foreignKey: "checklistId",
	onUpdate: "NO ACTION",
	constraints: false,
});
Checklist.hasMany(Alarm, {
	foreignKey: "checklistId",
	foreignKeyConstraint: false,
	onUpdate: "NO ACTION"
});
Checklist.belongsToMany(Action, {
	through: ChecklistAction,
	foreignKey: "checklistId"
});
Action.belongsToMany(Checklist, {
	through: ChecklistAction,
	foreignKey: "actionId"
});
export type AlarmSourceChecklist = Required<Alarm> & Required<Checklist>;
export type ChecklistActionType = Required<Checklist> & Required<Action>;