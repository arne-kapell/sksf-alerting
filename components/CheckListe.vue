<template>
	<v-data-table
	:headers="headers"
	:items="alerts"
	:items-per-page="5"
	class="elevation-1"
	>
	<template v-slot:top>
		<v-toolbar
			flat
		>
        <v-toolbar-title>Kriesenwerkzeuge</v-toolbar-title>	
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
		</v-toolbar>
	</template>
	<template v-slot:item.erledigt="{item}">
		<v-container
		class="px-0"
		fluid
		>
			<v-checkbox
			></v-checkbox>
		</v-container>
	</template>

	</v-data-table>
</template>

<script>
export default {
	data () {
		return {
			headers: [
				{
					text: "AKTIONSVORSCHLÄGE",
					align: "start",
					value: "vorschlaege",
				},
				{ text: "WERKZEUGE", value: "werkzeug" },
				{ text: "ERLEDIGT", value: "erledigt" },
			],
			alerts: [
				{
					vorschlaege: "Frozen Yogurt",
					werkzeug: 158,
					erledigt: true,
				},
				{
					vorschlaege: "Ice cream sandwich",
					werkzeug: 159,
					erledigt: false,
				},
				{
					vorschlaege: "Eclair",
					werkzeug: 159,
					erledigt: false,
				},
				{
					vorschlaege: "Cupcake",
					werkzeug: 159,
					erledigt: false,
				},
				{
					vorschlaege: "Gingerbread",
					werkzeug: 159,
					erledigt: false,
				},
				{
					vorschlaege: "Jelly bean",
					werkzeug: 159,
					erledigt: false,
				},
				{
					vorschlaege: "Lollipop",
					werkzeug: 159,
					erledigt: false,
				},
				{
					vorschlaege: "Honeycomb",
					werkzeug: 159,
					erledigt: false,
				},
				{
					vorschlaege: "Donut",
					werkzeug: 159,
					erledigt: false,
				},
				{
					vorschlaege: "KitKat",
					werkzeug: 159,
					erledigt: false,
				},
			],
		};

	},
};
</script>

<style scoped>


</style>