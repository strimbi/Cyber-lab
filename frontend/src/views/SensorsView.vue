<script setup>
import { ref, onMounted } from 'vue'

const API = 'https://localhost:3000/sensors'
const sensors = ref([])
const page = ref(1)
const limit = 5
const total = ref(0)
const error = ref('')


async function load()
{
    try{
        const res = await fetch(`${API}?page=${page.value}&limit=${limit}`)
        if(!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        sensors.value = data.items
        total.value = data.total
    }catch (e)
    {
        error.value = 'Could not load sensors: ' + e.message
    }
}

async function toggle(sensor)
{
    await fetch(`${API}/${sensor.id}/enabled`, 
    {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !sensor.enabled }),
    })
    load()
}

function go(delta)
{
    page.value += delta
    load()
}

onMounted(load)
</script>

<template>
    <h1>Sensors</h1>
    <p v-if="error" style="color:red">{{ error }}</p>
    <table border="1" cellpadding="6">
        <thead>
        <tr><th>ID</th><th>Name</th><th>Type</th><th>Tenant ID</th><th>Enabled</th><th></th></tr>
        </thead>
        <tbody>
            <tr v-for="s in sensors" :key="s.id">
                <td>{{ s.id }}</td>
                <td>{{ s.name }}</td>
                <td>{{ s.type }}</td>
                <td>{{ s.config.tenantId }}</td>
                <td>{{ s.enabled ? 'Yes' : 'No' }}</td>
                <td><button @click="toggle(s)">{{ s.enabled ? 'Disable' : 'Enable' }}</button></td>
            </tr>
        </tbody>
  </table>
  <p>
    <button :disabled="page === 1" @click="go(-1)">Previous</button>
    Page {{ page }} of {{ Math.max(1, Math.ceil(total / limit)) }}
    <button :disabled="page * limit >= total" @click="go(1)">Next</button>
  </p>
</template>