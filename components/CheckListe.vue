<template>
  <div class="v-container">
    <v-sheet
    id="aler-list-sheet"
    color="white"
    elevation="5"
    >
      <div class="v-container" id="aktion-list-header">
        <v-row>
      <!--TABLE HEADER-->
          <v-col>
            AKTIONSVORSCHLÄGE
          </v-col>
          <v-col>
            WERKZEUG
          </v-col>
          <v-col>
           ERLEDIGT
          </v-col>
       </v-row>
      </div>
      <!--ITEMS EINFÜGEN-->
      <div class="v-container">
      <v-item-group v-for="(aktion, index) in alerts" :key ="aktion + index">
        <v-row>
        <V-item class="aktion-item">
          <v-col>
            {{aktion.vorschlaege}}
          </v-col>
          <v-col>
            {{ aktion.werkzeug }}
          </v-col>
          <v-col>
             {{ aktion.erledigt }}
          </v-col>
          <v-col>
               <v-checkbox
                   v-model="checkbox2"
                  :label="`Checkbox 2: ${checkbox2.toString()}`"
              ></v-checkbox>
          </v-col>
        </V-item>
        </v-row>
      </v-item-group>
      </div>

      <!--PAGINATION-->

    </v-sheet>
  </div>
</template>

<script>
export default {
	data () {
		return {
			alerts: [
				{
					vorschlaege: "Frozen Yogurt",
					werkzeug: "12:34",
					erledigt: 75,
				},
				{
					vorschlaege: "Ice cream sandwich",
					werkzeug: 159,
					erledigt: 6.0,
				},
				{
					vorschlaege: "Eclair",
					werkzeug: 159,
					erledigt: 55,
				},
				{
					vorschlaege: "Cupcake",
					werkzeug: 159,
					erledigt: 25,
				},
				{
					vorschlaege: "Gingerbread",
					werkzeug: 159,
					erledigt: 6.0,
				},
				{
					vorschlaege: "Jelly bean",
					werkzeug: 159,
					erledigt: 6.0,
				},
				{
					vorschlaege: "Lollipop",
					werkzeug: 159,
					erledigt: 75,
				},
				{
					vorschlaege: "Honeycomb",
					werkzeug: 159,
					erledigt: 33,
				},
				{
					vorschlaege: "Donut",
					werkzeug: 159,
					erledigt: 22,
				},
				{
					vorschlaege: "KitKat",
					werkzeug: 159,
					erledigt: 88,
				},
			],
			checkbox1: true,
			checkbox2: false,
		};

	},
};
</script>

<style scoped>
#aktion-list-header{
  background-color: #f4f7fc;
  border-radius: 6px;
  font-size: x-large;
}
.aktion-item {
  padding: 10px;
}
#aler-list-sheet {
  border-radius: 6px;
}

</style>