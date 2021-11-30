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
	// LOGGED_IN: (state, newUser: UiUser) => (state.user = newUser),
};

export const actions: ActionTree<RootState, RootState> = {
	async fetchThings({ commit }) {
		const things = await this.$axios.$get("/things");
		// eslint-disable-next-line no-console
		console.log(things);
		commit("CHANGE_NAME", "New name");
	}
};
