import App from './App.vue'
import { createApp } from 'vue'
import "./style.css";
import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { router } from "./routes/routes.js";
import { Quasar, Dialog, Notify  } from 'quasar';
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass';
import axios from 'axios';

/* axios.defaults.baseURL = "http://localhost:5000/api/"; */

const app = createApp(App)
const pinia = createPinia()
axios.defaults.baseURL="https://backend-5ahx.onrender.com/api/"
app.use(router);
app.use(pinia);
app.use(Quasar, {
    plugins: { Dialog, Notify },
    config: {
      notify: {}/* look at QuasarConfOptions from the API card */
    }
  });

pinia.use(createPersistedState({
  storage: sessionStorage, // sessionStorage o tambien localStorage si prefieres
}))


app.mount('#app')

