<script>
/* eslint-disable vue/valid-v-slot */
</script>
<template>
<v-container>
  <v-card elevation="10">
    <v-data-table
      :headers="headers"
      :items="checklists"
      :items-per-page="5"
      :loading="loading"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat style="background-color: transparent;">
          <v-toolbar-title class="text-h4">Checklists</v-toolbar-title>
        </v-toolbar>
        <v-dialog v-model="dialogChecklist" width="500">
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
                  <template v-slot:default>
                    <v-list-item-content>
                      <v-list-item-title>{{ action.name }}</v-list-item-title>
                      <v-list-item-subtitle>{{
                        action.function +
                        (action.info ? "(" + action.info + ")" : "")
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>

            <v-divider />

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text @click="closeChecklist"> Close </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>

      <!-- source Template -->
			<template v-slot:item.source="{ item }">
				<v-list-item-content style="width: min-content;">
					<v-chip label color="accent">
						{{ item.source }}
					</v-chip>
				</v-list-item-content>
			</template>

      <template v-slot:item.actions="{ item }">
        <v-list-item-content style="width: min-content;">
          <v-btn
            small
            class="mr-2"
            @click="openChecklist(item)"
          >
            SHOW ACTIONS
          </v-btn>
        </v-list-item-content>
      </template>
    </v-data-table>
  </v-card>
</v-container>  
</template>

<script lang="ts">
export default {
  data() {
    return {
      headers: [
        { text: "Name", align: "start", value: "name" },
        { text: "Action count", value: "actionCount" },
        { text: "Module", value: "source" },
        { text: "Actions", value: "actions" },
      ],
	  dialogChecklist: false,
	  currentChecklist: {} as Checklist,
	  checklists: [] as Checklist[],
    loading: true,
    };
  },
  methods: {
    openChecklist(item: Checklist) {
      this.currentChecklist = this.checklists[this.checklists.indexOf(item)] || ({} as Checklist);
      this.dialogChecklist = true;
    },
    closeChecklist() {
      this.dialogChecklist = false;
      this.$nextTick(() => {
        this.currentChecklist = {} as Checklist;
      });
    },
  },
  async fetch() {
    const res = await this.$axios.$get("/checklists");
    this.checklists = res.checklists.map((c: Checklist) => ({
      ...c, 
      actionCount: c.actions.length
    }));
    this.loading = false;
  },
  mounted() {
	  this.$fetch();
  }
};
</script>

<style scoped>
</style>