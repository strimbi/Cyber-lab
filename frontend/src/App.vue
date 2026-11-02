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
  <main>
    <h1>Users</h1>
    <p v-if="error" style="color: red">{{ error }}</p>
    <table v-else>
      <thead>
        <tr><th>ID</th><th>First Name</th><th>Last Name</th><th>Status</th></tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.firstName }}</td>
          <td>{{ user.lastName }}</td>
          <td>{{ user.isActive }}</td>
        </tr>
      </tbody>
    </table>
  </main>
</template>