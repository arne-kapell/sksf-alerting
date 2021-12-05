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
			class="elevation-1"
			>

				<!-- source Template -->
				<template v-slot:item.source="{ item }">
					<v-list-item-content>
						<v-chip label >
							{{ item.source }}
						</v-chip>
					</v-list-item-content>
				</template>

				<!-- api Template -->
				<template v-slot:item.api="{ item }">
					<v-list-item-content>
						<v-chip label >
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

				<template v-slot:top>
					<v-toolbar flat style="background-color: transparent;">
						<v-toolbar-title>Überblick</v-toolbar-title>
						<v-spacer />
						<v-container class="d-flex justify-end align-center mr-0 mt-1" style="width: min-content;">
							<v-progress-circular v-if="stats.high" :value="stats.high / stats.total * 100" color="orange" :size="50" class="mx-1">{{ stats.high }}</v-progress-circular>
							<v-progress-circular v-if="!stats.critical" :value="stats.critical / stats.total * 100" color="red" :size="50" class="mx-1">{{ stats.critical }}</v-progress-circular>
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
						>
						<v-card>
							<v-card-title class="text-h5 accent">
								<span>Checklist: <b>{{ currentChecklist.name }}</b></span>
								<v-chip label class="ml-auto">{{ currentChecklist.source }}</v-chip>
							</v-card-title>

							<v-card-text>
								<v-list subheader>
									<!-- <v-subheader>Recent chat</v-subheader> -->

									<v-list-item
										v-for="action in currentChecklist.actions"
										:key="action.uid"
									>
										<template v-slot:default="{ active }">
											<v-list-item-content>
												<v-list-item-title>{{ action.name }}</v-list-item-title>
												<v-list-item-subtitle>{{ action.function + ((action.info) ? '(' + action.info + ')' : '') }}</v-list-item-subtitle>
											</v-list-item-content>

											<v-list-item-action>
											<v-checkbox
												:input-value="active"
												color="accent"
											/>
											</v-list-item-action>
										</template>
									</v-list-item>
								</v-list>
							</v-card-text>

							<v-divider></v-divider>

							<v-card-actions>
							<v-spacer></v-spacer>
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

					<v-dialog v-model="dialogDelete" max-width="500px">
						<v-card>
						<v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="accent" text @click="closeDelete">Cancel</v-btn>
							<v-btn color="accent" text @click="deleteItemConfirm">OK</v-btn>
							<v-spacer></v-spacer>
						</v-card-actions>
						</v-card>
					</v-dialog>
				</template>
 
				<template v-slot:item.actions="{ item }">
					<v-list-item-content>
						<v-container class="d-flex flex-row">
							<v-btn
								small
								class="mr-2"
								@click="openChecklist(item)"
									:color="(!item.progress) ? 'error' : (item.progress < item.actions.length) ? 'warning' : 'success'"
								>
								Checklist
							</v-btn>
							<v-icon
								small
								@click="deleteItem(item)"
								>
								mdi-delete
							</v-icon>
						</v-container>
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
				{ text: "Source", value: "api" },
				{ text: "Actions", value: "actions", align: "end", sortable: false},
			],
			editedIndex: -1,
			editedItem: {
			} as Checklist,
			defaultItem: {
				message: "",
				risk: 0,
				source: 0,
			},
			checklists: [] as (Checklist | false)[],
			dialogChecklist: false,
			currentChecklist: {} as Checklist,
			search: "" as string,
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
		openChecklist(alarm: Alarm) {
			const index = this.alarms.indexOf(alarm);
			this.currentChecklist = this.checklists[index] || {} as Checklist;
			this.dialogChecklist = true;
		},
			
		closeChecklist () {
			this.dialogChecklist = false;
			this.$nextTick(() => {
				this.currentChecklist = {} as Checklist;
			});
		},

		deleteItem (item) {
			this.editedIndex = this.desserts.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.dialogDelete = true;
		},

		deleteItemConfirm () {
			this.desserts.splice(this.editedIndex, 1);
			this.closeDelete();
		},

		closeDelete () {
			this.dialogDelete = false;
			this.$nextTick(() => {
				this.editedItem = Object.assign({}, this.defaultItem);
				this.editedIndex = -1;
			});
		}
	},
	computed: {
		formTitle () {
			return this.editedIndex === -1 ? "New Item" : "Edit Item";
		},
		alarms() {
			return this.$store.state.alarms;
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
	watch: {
		dialog (val) {
			val || this.close();
		},
		dialogDelete (val) {
			val || this.closeDelete();
		},
		async alarms (alarms) {
			const asyncForEach = async (array: any[], callback: (item: any, index: number, array: any[]) => Promise<void>) => {
				for (let index = 0; index < array.length; index++) {
					await callback(array[index], index, array);
				}
			};
			const uids: number[] = alarms.map((alarm: Alarm) => alarm.checklistId | 0);
			const checklists: (Checklist | false)[] = [];
			asyncForEach(uids, async (uid: number) => {
				if (uid) {
					const res = await this.$axios.get("/checklist/" + uid);
					checklists.push(res.data as Checklist);
				} else {
					checklists.push(false);
				}
			});
			console.log(uids, checklists);
			this.checklists = checklists;
		}
	}
});
</script>
