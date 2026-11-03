import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import SensorsView from './views/SensorsView.vue'
import AddSensorView from './views/AddSensorView.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
    {path: '/', redirect: '/sensors'},
    {path: '/sensors', component: SensorsView},
    {path: '/sensors/new', component: AddSensorView},
    ],
})


createApp(App).use(router).mount('#app')
