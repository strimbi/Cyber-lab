<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({ name: '', type: 'o365_mail', tenantId: '', clientId: '', clientSecret: ''})
const error = ref('')
const loading = ref(false)
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function submit()
{
    error.value = ''
    if(!form.name.trim()) return (error.value = 'Name is required')
    if(!uuid.test(form.tenantId)) return (error.value = 'Tenant ID must be an UUID')
    if(!uuid.test(form.clientId)) return (error.value = 'Client ID must be an UUID')
    if(!form.clientSecret) return (error.value = 'Client secret is required')

    loading.value = true
    try
    {
        const res = await fetch('http://localhost:3000/sensors',{
            method: 'POST',
            headers: { 'ContentType': 'application/json' },
            body: JSON.stringify({
                name: form.name,
                type: form.type,
                config: { tenantId: form.tenantId, clientId: form.clientId, clientSecret: form.clientSecret },
            }),
        })

        const data = await res.json()
        if(!res.ok)
        {
            error.value = Array.isArray(data.message) ? data.message.join(', ') : data.message
            return
        }
        router.push('/sensors')
    }catch (e)
    {
        error.value = 'Could not reach the server'
    }finally
    {
        loading.value = false
    }
}
</script>

<template>
    <h1>Add sensor</h1>
    <div style = "display:grid; gap:0.75rem; max-width:420px">
        <label>Name <input v-model="form.name" /></label>
        <label>Type
            <select v-model="form.type">
                <option value="o365_mail">Microsoft Office 365 mails</option>
            </select>
        </label>
    <label>Tenant ID <input v-model="form.tenantId" /></label>
    <label>Application (client) ID <input v-model="form.clientId" /></label>
    <label>Client secret <input v-model="form.clientSecret" type="password" /></label>
    <p v-if="error" style="color:red">{{ error }}</p>
    <button :disabled="loading" @click="submit">{{ loading ? 'Validating...' : 'Save sensor' }}</button>
    </div>
</template>