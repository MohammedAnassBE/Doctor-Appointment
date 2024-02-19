import './index.css'
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';
import { createApp } from 'vue'
import router from './router'
import App from './App.vue'

import {
  Button,
  Card,
  Input,
  setConfig,
  frappeRequest,
  resourcesPlugin,
} from 'frappe-ui'

let app = createApp(App)

setConfig('resourceFetcher', frappeRequest)

app.use(router)
app.use(resourcesPlugin)
app.use(VCalendar, {})

app.component('Button', Button)
app.component('Card', Card)
app.component('Input', Input)

app.mount('#app')
