<template>
  <div class="v-container">
    <v-sheet
    id="aler-list-sheet"
    color="white"
    elevation="5"
    >
      <div class="v-container" id="alert-list-header">
        <v-row>
      <!--TABLE HEADER-->
          <v-col>
            ALERTNAME
          </v-col>
          <v-col>
            ZEITPUNKT
          </v-col>
          <v-col>
           RISIKO
          </v-col>
          <v-col>
            HANDLUNGSBEDARF
          </v-col>
          <v-col>
            DETAILS
          </v-col>
       </v-row>
      </div>
      <!--ITEMS EINFÜGEN-->
      <div class="v-container">
      <v-item-group v-for="(alert, index) in alerts" :key ="alert + index">
        <v-row>
        <V-item class="alert-item">
          <v-col>
            {{alert.name}}
          </v-col>
          <v-col>
            {{ alert.zeitpunkt }}
          </v-col>
          <v-col>
            {{ alert.risiko }}
          </v-col>
          <v-col>
            {{ alert.handlungsbedarf }}
          </v-col>
          <v-col v-if="alert.risiko < 50">
            <v-btn color="#f4f7fc">
              HIER KLICKEN
            </v-btn>
          </v-col>
          <v-col v-else-if="alert.risiko >= 50 && alert.risiko < 75">
            <v-btn color="yellow">
              HIER KLICKEN
            </v-btn>
          </v-col>
          <v-col v-else-if="alert.risiko >= 75">
            <v-btn color="red">
              HIER KLICKEN
            </v-btn>
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


      headers: [
        {
          text: 'Dessert (100g serving)',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Calories', value: 'calories' },
        { text: 'Fat (g)', value: 'fat' },
        { text: 'Carbs (g)', value: 'carbs' },
        { text: 'Protein (g)', value: 'protein' },
        { text: 'Iron (%)', value: 'iron' },
      ],
      alerts: [
        {
          name: 'Frozen Yogurt',
          zeitpunkt: '12:34',
          risiko: 75,
          handlungsbedarf: 'Ja',
        },
        {
          name: 'Ice cream sandwich',
          zeitpunkt: 159,
          risiko: 6.0,
          handlungsbedarf: 'Nein',
        },
        {
          name: 'Eclair',
          zeitpunkt: 159,
          risiko: 55,
          handlungsbedarf: 'Nein',
        },
        {
          name: 'Cupcake',
          zeitpunkt: 159,
          risiko: 25,
          handlungsbedarf: 'Nein',
        },
        {
          name: 'Gingerbread',
          zeitpunkt: 159,
          risiko: 6.0,
          handlungsbedarf: 'Nein',
        },
        {
          name: 'Jelly bean',
          zeitpunkt: 159,
          risiko: 6.0,
          handlungsbedarf: 'Nein',
        },
        {
          name: 'Lollipop',
          zeitpunkt: 159,
          risiko: 75,
          handlungsbedarf: 'Ja',
        },
        {
          name: 'Honeycomb',
          zeitpunkt: 159,
          risiko: 33,
          handlungsbedarf: 'Nein',
        },
        {
          name: 'Donut',
          zeitpunkt: 159,
          risiko: 22,
          handlungsbedarf: 'Nein',
        },
        {
          name: 'KitKat',
          zeitpunkt: 159,
          risiko: 88,
          handlungsbedarf: 'Ja',
        },
      ],
    }

  },
}
</script>

<style scoped>
#alert-list-header{
  background-color: #f4f7fc;
  border-radius: 6px;
  font-size: x-large;
}
.alert-item {
  padding: 10px;
}
#aler-list-sheet {
  border-radius: 6px;
}

</style>