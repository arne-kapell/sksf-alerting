import { GetterTree, ActionTree, MutationTree } from "vuex";


export const state = () => ({
	alarms: [] as Alarm[],
	numbers: 1 as number
});

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
	alarms: state => state.alarms
};

export const mutations: MutationTree<RootState> = {
	ADD_ALARM: (state, newAlarm: Alarm) => (state.alarms.push(newAlarm)),
	SET_ALARMS: (state, alarms: Alarm[]) => (state.alarms = alarms)
};

export const actions: ActionTree<RootState, RootState> = {
	async getAlarms({ commit }) {
		const res = await this.$axios.$get("/alarms");
		commit("SET_ALARMS", res.alarms);
	}
};

