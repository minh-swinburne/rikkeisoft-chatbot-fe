import '@/styles/quasar.scss'
import 'quasar/src/css/index.sass'
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/roboto-font/roboto-font.css'

// Import necessary plugins
import { Dialog, Notify } from 'quasar'

export default {
  plugins: {
    Dialog, // Register Dialog plugin
    Notify, // Register Notify plugin
  },
  config: {
    dialog: {
      focus: 'cancel', // Focus on the cancel button by default
      persistent: true, // Dialogs are persistent by default
    },
    notify: {
      position: 'bottom-right',
      timeout: 2000,
    },
  },
}
