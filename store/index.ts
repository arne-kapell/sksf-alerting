import { GetterTree, ActionTree, MutationTree } from "vuex";


export const state = () => ({
	alarms: [] as Alarm[],
	numbers: 1 as number,
	user: [] as User[]
});

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
	alarms: state => state.alarms,
	user: state => state.user
};

export const mutations: MutationTree<RootState> = {
	ADD_ALARM: (state, newAlarm: Alarm) => (state.alarms.push(newAlarm)),
	SET_ALARMS: (state, alarms: Alarm[]) => (state.alarms = alarms),
	SET_USER: (state, user: User[]) => (state.user = user),
};

export const actions: ActionTree<RootState, RootState> = {
	async getAlarms({ commit }) {
		const res = await this.$axios.$get("/alarms");
		commit("SET_ALARMS", res.alarms);
	},
	async getUser({ commit }) {
		const res = await this.$axios.$get("/user-info");
		commit("SET_USER", res.user);
	}
};

