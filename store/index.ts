import { GetterTree, ActionTree, MutationTree } from "vuex";


export const state = () => ({
	alarms: [] as Alarm[],
	checklists: [] as Checklist[],
	progressPercents: [] as (number | false)[],
	numbers: 1 as number
});

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
	alarms: state => state.alarms
};

export const mutations: MutationTree<RootState> = {
	ADD_ALARM: (state, newAlarm: Alarm) => (state.alarms.push(newAlarm)),
	SET_ALARMS: (state, alarms: Alarm[]) => (state.alarms = alarms),
	SET_CHECKLISTS: (state, checklists: Checklist[]) => (state.checklists = checklists),
	SET_PP: (state, progressPercents: (number | false)[]) => (state.progressPercents = progressPercents)
};

export const actions: ActionTree<RootState, RootState> = {
	async getAlarms({ commit, dispatch }, limit=100) {
		const res = await this.$axios.$get("/alarms/" + limit);
		commit("SET_ALARMS", res.alarms);
		dispatch("getChecklistWithPP");
	},
	async getChecklistWithPP({ state, commit }) {
		const alarms = state.alarms;
		const uids: number[] = alarms.map((alarm: Alarm) => alarm.checklistId | 0);
		const checklists: (Checklist | false)[] = [];
		const progressPercents: (number | false)[] = [];
		await asyncForEach(uids, async (uid: number, i: number) => {
			if (uid) {
				const res = await this.$axios.get("/checklist/" + uid);
				const checklist = res.data as Checklist;
				checklist.actions = checklist.actions.map((action: ActionType, index: number) => ({
					...action,
					done: index < alarms[i].progress
				}));
				checklists.push(checklist);
				progressPercents.push(Math.round(alarms[i].progress / res.data.actions.length * 100) | 0);
			} else {
				checklists.push(false);
				progressPercents.push(false);
			}
		});
		commit("SET_CHECKLISTS", checklists);
		commit("SET_PP", progressPercents);
	}
};

const asyncForEach = async (array: any[], callback: (item: any, index: number, array: any[]) => Promise<void>) => {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
};