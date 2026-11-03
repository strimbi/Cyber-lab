<script setup>
import { ref, onMounted } from 'vue'

const users = ref([])
const error = ref('')

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/users')
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    users.value = await response.json()
  } catch (e) {
    error.value = 'Could not load users: ' + e.message
  }
})
</script>

<template>
  <nav style="display:flex; gap:1rem; padding:1rem; border-bottom:1px solid #ccc">
    <RouterLink to="/sensors">Sensors</RouterLink>
    <RouterLink to="/sensors/new">Add sensor</RouterLink>
  </nav>
  <main style="padding:1rem"><RouterView /></main>
</template>