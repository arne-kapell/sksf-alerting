<script>
/* eslint-disable vue/valid-v-slot */
</script>
<template>
  <v-data-table
    :headers="headers"
    :items="checklists"
    :items-per-page="5"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Kriesenwerkzeuge</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
      </v-toolbar>
      <v-dialog v-model="dialogChecklist" width="500">
        <v-card>
          <v-card-title class="text-h5 accent">
            <span
              >Checklist: <b>{{ currentChecklist.name }}</b></span
            >
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

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" text @click="closeChecklist"> Close </v-btn>
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
            @click="openChecklist(item)"
          >
            SHOW ACTIONS
          </v-btn>
        </v-container>
      </v-list-item-content>
    </template>
  </v-data-table>
</template>

<script lang="ts">
export default {
  data() {
    return {
      headers: [
        { text: "NAME", align: "start", value: "name" },
        { text: "ACTION COUNT", value: "actionCount" },
        { text: "MODULE", value: "source" },
        { text: "ACTIONS", value: "actions" },
      ],
	  dialogChecklist: false,
	  currentChecklist: {} as Checklist,
	  checklists: [] as Checklist[],
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
  },
  mounted() {
	  this.$fetch();
  }
};
</script>

<style scoped>
</style>