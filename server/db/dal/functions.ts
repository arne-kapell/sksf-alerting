import { Op } from "sequelize";
import * as m from "../models";

export const createUser = async (payload: m.UserInput): Promise<m.UserOuput> => {
	const user = await m.User.create(payload);
	return user;
};

export const updateUser = async (id: number, payload: Partial<m.UserInput>): Promise<m.UserOuput> => {
	const user = await m.User.findByPk(id);
	if (!user) {
		// @todo throw custom error
		throw new Error("not found");
	}
	const updatedUser = await (user as m.User).update(payload);
	return updatedUser;
};