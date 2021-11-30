import { Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize, Sequelize: any) => {
	const User = sequelize.define("user", {
		uid: {
			type: Sequelize.NUMBER
		},
		name: {
			type: Sequelize.STRING
		},
		mail: {
			type: Sequelize.STRING
		},
		pwdHash: {
			type: Sequelize.STRING
		},
		groupId: {
			type: Sequelize.NUMBER
		}
	});
	return User;
};

module.exports = (sequelize: Sequelize, Sequelize: any) => {
	const Action = sequelize.define("action", {
		id: {
			type: Sequelize.NUMBER
		},
		Content: {
			type: Sequelize.STRING
		},
		done: {
			type: Sequelize.BOOLEAN
		}
	});
	return Action;
};

module.exports = (sequelize: Sequelize, Sequelize: any) => {
	const Source = sequelize.define("source", {
		uid: {
			type: Sequelize.NUMBER
		},
		name: {
			type: Sequelize.STRING
		},
		location: {
			type: Sequelize.STRING
		}
	});
	return Source;
};

module.exports = (sequelize: Sequelize, Sequelize: any) => {
	const Checklist = sequelize.define("checklist", {
		id: {
			type: Sequelize.NUMBER
		},
		category: {
			type: Sequelize.STRING
		},
		actions: {
			type: Sequelize.ACTION
		}
	});
	return Checklist;
};

module.exports = (sequelize: Sequelize, Sequelize: any) => {
	const Alarm = sequelize.define("alarm", {
		uid: {
			type: Sequelize.NUMBER
		},
		category: {
			type: Sequelize.STRING
		},
		datetime: {
			type: Sequelize.DATE
		},
		risk: {
			type: Sequelize.STRING
		},
		source: {
			type: Sequelize.SOURCE
		},
		checklist: {
			type: Sequelize.ACTION
		}
	});
	return Alarm;
};