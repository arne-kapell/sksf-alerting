import { GetterTree, ActionTree, MutationTree } from "vuex";

export const state = () => ({
	alarms: [] as Alarm[],
});

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
	alarms: state => state.alarms
};

export const mutations: MutationTree<RootState> = {
	ADD_ALARM: (state, newAlarm: Alarm) => (state.alarms.push(newAlarm)),
	SET_ALARMS: (state, alarms: Alarm[]) => (state.alarms = alarms),
	// LOGGED_IN: (state, newUser: UiUser) => (state.user = newUser),
};

export const actions: ActionTree<RootState, RootState> = {
	async getAlarms({ commit }) {
		const alarms = await this.$axios.$get("/alarms");
		// eslint-disable-next-line no-console
		console.log("fetched alarms", alarms);
		commit("SET_ALARMS", alarms);
	}
};
