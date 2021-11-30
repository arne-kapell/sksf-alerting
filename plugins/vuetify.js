import { defineNuxtPlugin } from '#app'
import { createVuetify } from 'vuetify'

import {
    VApp,
    VAlert,
    VDataTable,
    VBtn,
    VCard,
    VItemGroup,
    VItem,
    VSheet,
    VCol,
    VRow,
    VSpacer,
    VDivider,
    VAppBar,
    VNavigationDrawer,
    VToolbar

} from 'vuetify/components'

export default defineNuxtPlugin((nuxtApp) => {
    const vuetify = createVuetify({
        components: {
            VApp,
            VDataTable,
            VAlert,
            VBtn,
            VItemGroup,
            VCard,
            VItem,
            VSheet,
            VCol,
            VRow,
            VSpacer,
            VDivider,
            VAppBar,
            VNavigationDrawer,
            VToolbar
        }
    })
    nuxtApp.vueApp.use(vuetify)
 })
