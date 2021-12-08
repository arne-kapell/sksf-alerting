<script>
/* eslint-disable vue/valid-v-slot */
</script>
<template>
<v-container>
    <v-card elevation="10">
		<template>
			<!-- Data Table -->
			<v-data-table
			:headers="headers"
			:items="alarms"
			:search="search"
			multi-sort
			class="elevation-1"
			>

				<!-- source Template -->
				<template v-slot:item.source="{ item }">
					<v-list-item-content style="width: min-content;">
						<v-chip label color="accent">
							{{ item.source }}
						</v-chip>
					</v-list-item-content>
				</template>

				<!-- api Template -->
				<template v-slot:item.api="{ item }">
					<v-list-item-content style="width: min-content;">
						<v-chip label>
							{{ item.api }}
						</v-chip>
					</v-list-item-content>
				</template>

				<!-- Farbe des Risikos -->
				<template v-slot:item.risk="item">
					<v-list-item-content style="text-align: center; width: min-content">
						<v-chip
							:color="getColor(item.value)"
							>
							<span>{{item.value}}</span>
						</v-chip>
					</v-list-item-content>
				</template>

				<!-- Zeitpunktdarstellung-->
				<template v-slot:item.datetime="item">
					{{item.value = parseZeitpunkt(item.value)}}
				</template>

				<template v-slot:top="item">
					<v-toolbar flat style="background-color: transparent;">
						<v-toolbar-title  class="text-h4">Dashboard</v-toolbar-title>
						<v-spacer />
						<v-container class="d-flex justify-end align-center mr-0 mt-1" style="width: min-content;">
							<v-progress-circular :rotate="-90" v-if="stats.high" :value="stats.high / stats.total * 100" color="orange" :size="50" class="mx-1">{{ stats.high }}</v-progress-circular>
							<v-progress-circular :rotate="-90" v-if="stats.critical" :value="stats.critical / stats.total * 100" color="red" :size="50" class="mx-1">{{ stats.critical }}</v-progress-circular>
						</v-container>
						<v-container style="width: 20%;">
							<v-text-field
								v-model="search"
								append-icon="mdi-magnify"
								label="Search alerts"
								single-line
								hide-details
								color="accent"
								clearable
								/>
						</v-container>
					</v-toolbar>

					<v-dialog
						v-model="dialogChecklist"
						width="500"
						@click:outside="closeChecklist"
						>
						<v-card v-if="currentChecklist && currentChecklist.uid" :loading="loadingProgress">
							<v-card-title class="text-h5 accent">
								<span>Checklist: <b>{{ currentChecklist.name }}</b></span>
								<v-chip label class="ml-auto">{{ currentChecklist.source }}</v-chip>
							</v-card-title>

							<v-card-text>
								<v-list subheader>

									<v-list-item
										v-for="action in currentChecklist.actions"
										:key="action.uid"
									>
										<template v-slot:default>
											<v-list-item-content>
												<v-list-item-title>{{ action.name }}</v-list-item-title>
												<span class="secondary--text text--darken-1 font-weight-light">{{ action.function + ((action.info) ? '(' + action.info + ')' : '') }}</span>
											</v-list-item-content>

											<v-list-item-action>
											<v-checkbox
												:input-value="action.done"
												@change="setProgress(currentChecklist, action, !action.done)"
												color="accent"
												:disabled="loadingProgress"
											/>
											</v-list-item-action>
										</template>
									</v-list-item>
								</v-list>
							</v-card-text>

							<v-divider />

							<v-card-actions>
								<v-spacer />
								<v-btn
									color="red"
									text
									@click="closeChecklist"
								>
								Close
								</v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>
				</template>
 
				<template v-slot:item.actions="{ item }">
					<v-list-item-content>
						<v-container>
							<v-btn
								small
								class="mr-2"
								:disabled="!item.checklistId"
								@click="openChecklist(item.uid)"
									:color="(!checklists[alarms.indexOf(item)] || !checklists[alarms.indexOf(item)].actions) ? '' : (!item.progress) ? 'error' : (item.progress < checklists[alarms.indexOf(item)].actions.length) ? 'warning' : 'green'"
								>
								Checklist
							</v-btn>
						</v-container>
					</v-list-item-content>
				</template>

				<template v-slot:item.progressPercent="{ item }">
					<v-list-item-content style="text-align: center;">
						{{ item.value = (typeof item.progressPercent === "number") ? item.progressPercent + "%" : "/" }}
					</v-list-item-content>
				</template>

			</v-data-table>
		</template>
    </v-card>
</v-container>
</template>


<script lang="ts">
/* eslint-disable vue/valid-v-slot */
import Vue from "vue";
export default Vue.extend({
	data () {
		return {
			headers: [
				{ text: "Alert", align: "start", sortable: false, value: "message" },
				{ text: "Risk", value: "risk" },
				{ text: "Timestamp ", value: "datetime" },
				{ text: "Module", value: "source" },
				{ text: "System", value: "api" },
				{ text: "Actions", value: "actions", align: "end", sortable: false},
				{ text: "Progress", value: "progressPercent", sortable: true},
			],
			editedIndex: -1,
			editedItem: {
			} as Checklist,
			defaultItem: {
				message: "",
				risk: 0,
				source: 0,
			},
			dialogChecklist: false,
			currentIndex: null as number | null,
			currentChecklist: {} as Checklist,
			search: "" as string,
			loadingProgress: false
		};
	},

	methods: {
		parseZeitpunkt(date: string) {
			const ts = new Date(date);
			return ts.toLocaleString("de-DE", {
				day: "numeric",
				month: "short",
				year: "numeric",
				hour: "numeric",
				minute: "2-digit",
				second: undefined
			});
		},
		getColor (risk: number) {
			if (risk > 75) return "red";
			else if (risk >= 50) return "orange";
			else return "green";
		},
		openChecklist(uid=-1, openNew=true) {
			if (!this.currentIndex) {
				this.currentIndex = this.alarms.findIndex(item => item.uid === uid);
			}
			this.currentChecklist = this.checklists[this.currentIndex] || {} as Checklist;
			if (openNew) this.dialogChecklist = true;
		},
		async setProgress(checklist: Checklist, action: ActionType, active: boolean) {
			this.loadingProgress = true;
			const progress = (active) ? checklist.actions.indexOf(action) + 1 : checklist.actions.indexOf(action);
			const alarm = this.alarms[this.checklists.indexOf(checklist)];
			await this.$axios.$put("/alarms/progress", {
				uid: alarm.uid,
				progress: progress,
			});
			this.$store.dispatch("getAlarms");
		},
		closeChecklist () {
			this.dialogChecklist = false;
			this.currentIndex = null;
			this.currentChecklist = null;
			this.$nextTick(() => {
				this.currentChecklist = {} as Checklist;
			});
		}
	},
	computed: {
		alarms() {
			return this.$store.state.alarms.map((item, i) => ({
				...item,
				progressPercent: this.$store.state.progressPercents[i]
			}));
		},
		checklists() {
			return this.$store.state.checklists;
		},
		stats() {
			return {
				total: this.$store.state.alarms.length,
				critical: this.$store.state.alarms.filter((a: Alarm) => a.risk > 75).length,
				high: this.$store.state.alarms.filter((a: Alarm) => a.risk >= 50 && a.risk <= 75).length,
				medium: this.$store.state.alarms.filter((a: Alarm) => a.risk < 50).length
			};
		}
	},
	async mounted() {
		this.$store.dispatch("getChecklistWithPP");
	},
	watch: {
		checklists() {
			if (this.currentIndex) this.openChecklist(false);
			if (this.loadingProgress) this.loadingProgress = false;
		}
	}
});
</script>
