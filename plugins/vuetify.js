import { defineNuxtPlugin } from '#app'
import { createVuetify } from 'vuetify'
import {
    VAlert,
    VAppBar,
    VBtn,
    VNavigationDrawer,
    VToolbar

} from 'vuetify/components'

export default defineNuxtPlugin((nuxtApp) => {
    const vuetify = createVuetify({
        components: {
            VAlert,
            VAppBar,
            VBtn,
            VNavigationDrawer,
            VToolbar
        }
    })
    nuxtApp.vueApp.use(vuetify)
 })