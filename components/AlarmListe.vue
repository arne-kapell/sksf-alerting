<template>
  <div class="v-container col-6"
       id="alert-list-sheet"
  >
    <v-sheet
    color="white"
    elevation="5"
    >
      <template>
        <!-- Data Table -->
        <v-data-table
          :headers="headers"
          :items="desserts"
          class="elevation-1"
        >

          <!-- Farbe des Risikos -->
          <template v-slot:item.risiko="{ item }">
            <v-chip
              :color="getColor(item.risiko)"
              light
            >
              {{ item.risiko }}
            </v-chip>
          </template>
          <template v-slot:top>
            <v-toolbar
              flat
            >
              <v-toolbar-title>Überblick</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
              <v-spacer></v-spacer>
              <v-dialog
                v-model="dialog"
                max-width="500px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    light
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    +
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col id='colAlarmListe'
                          cols="12"
                          sm="6"
                          md="4"
                        >
                          <v-text-field
                            v-model="editedItem.alertname"
                            label="Alertname"
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                          md="4"
                        >
                          <v-text-field
                            v-model="editedItem.zeitpunkt"
                            label="Zeitpunkt"
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                          md="4"
                        >
                          <v-text-field
                            v-model="editedItem.risiko"
                            label="Risiko (%)"
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                          md="4"
                        >
                          <v-text-field
                            v-model="editedItem.handlungsbedarf"
                            label="Handlungsbedarf"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="accent"
                      text
                      @click="close"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      color="accent"
                      text
                      @click="save"
                    >
                      Save
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
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn
              small
              class="mr-2"
              @click="getInformation(item)"
            >
              Information
            </v-btn>
            <v-icon
              small
              class="mr-2"
              @click="editItem(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              small
              @click="deleteItem(item)"
            >
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </template>
    </v-sheet>
  </div>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
	data () {
		return {
			headers: [
				{
					text: "ALERTNAME",
					align: "start",
					sortable: false,
					value: "alertname",
				},
				{ text: "ZEITPUNKT ", value: "zeitpunkt" },
				{ text: "RISIKO (%)", value: "risiko" },
				{ text: "HANDLUNGSBEDARF", value: "handlungsbedarf" },
				{ text: "DETAILS", value: "actions", sortable: false },
			],
			desserts: [
				{
					alertname: "Frozen Yogurt",
					zeitpunkt: 159,
					handlungsbedarf: 24,
					details: 4.0,
					risiko: 54,
				},
				{
					alertname: "Ice cream sandwich",
					zeitpunkt: 159,
					handlungsbedarf: 24,
					details: 4.0,
					risiko: 64,
				},
				{
					alertname: "Eclair",
					zeitpunkt: 159,
					handlungsbedarf: 24,
					details: 4.0,
					risiko: 91,
				},
				{
					alertname: "Cupcake",
					zeitpunkt: 159,
					handlungsbedarf: 24,
					details: 4.0,
					risiko: 15,
				},
				{
					alertname: "Gingerbread",
					zeitpunkt: 159,
					handlungsbedarf: 24,
					details: 4.0,
					risiko: 12,
				},
				{
					alertname: "Jelly bean",
					zeitpunkt: 159,
					handlungsbedarf: 24,
					details: 4.0,
					risiko: 18,
				},
				{
					alertname: "Lollipop",
					zeitpunkt: 159,
					handlungsbedarf: 24,
					details: 4.0,
					risiko: 18,
				},
				{
					alertname: "Honeycomb",
					zeitpunkt: 159,
					handlungsbedarf: 24,
					details: 4.0,
					risiko: 91,

				},
				{
					alertname: "Donut",
					zeitpunkt: 159,
					handlungsbedarf: 24,
					details: 4.0,
					risiko: 11,
				},
				{
					alertname: "KitKat",
					zeitpunkt: 159,
					handlungsbedarf: 24,
					details: 4.0,
					risiko: 51,
				},
			],
			editedIndex: -1,
			editedItem: {
				alertname: "",
				risiko: 0,
				handlungsbedarf: 0,
			},
			defaultItem: {
				alertname: "",
				risiko: 0,
				handlungsbedarf: 0,
				carbs: 0,
				protein: 0,
			},

			computed: {
				formTitle () {
					return this.editedIndex === -1 ? "New Item" : "Edit Item";
				},
			},

			watch: {
				dialog (val) {
					val || this.close();
				},
				dialogDelete (val) {
					val || this.closeDelete();
				},
			},
		};
	},

	methods: {
		getColor (risiko) {
			if (risiko > 75) return "red";
			else if (risiko > 50) return "orange";
			else return "green";
		},
		editItem (item) {
			this.editedIndex = this.desserts.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.dialog = true;
		},

		getInformation(item) {
			this.editedIndex = this.desserts.indexOf(item);
			this.editedItem = Object.assign({}, item);
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

		close () {
			this.dialog = false;
			this.$nextTick(() => {
				this.editedItem = Object.assign({}, this.defaultItem);
				this.editedIndex = -1;
			});
		},

		closeDelete () {
			this.dialogDelete = false;
			this.$nextTick(() => {
				this.editedItem = Object.assign({}, this.defaultItem);
				this.editedIndex = -1;
			});
		},

		save () {
			if (this.editedIndex > -1) {
				Object.assign(this.desserts[this.editedIndex], this.editedItem);
			} else {
				this.desserts.push(this.editedItem);
			}
			this.close();
		},
	},
});
</script>

<style scoped>
</style>
