import { defineNuxtPlugin } from '#app'
import { createVuetify } from 'vuetify'
import {
    VAlert,
    VAppBar,
    VBtn
} from 'vuetify/components'

export default defineNuxtPlugin((nuxtApp) => {
    const vuetify = createVuetify({
        components: {
            VAlert,
            VAppBar,
            VBtn
        }
    })
    nuxtApp.vueApp.use(vuetify)
 })