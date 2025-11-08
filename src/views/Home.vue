<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import '@/styles/home.css'

export default defineComponent({
    name: 'HomeView',
    setup() {
        const username = ref('')
        const errorMessage = ref('')
        const loading = ref(false)
        const router = useRouter()

        const handleSubmit = () => {
        errorMessage.value = ''

        if (!username.value.trim()) {
            errorMessage.value = 'Please enter a GitHub username.'
            return
        }

        const usernamePattern = /^[a-zA-Z0-9-]+$/
        if (!usernamePattern.test(username.value)) {
            errorMessage.value =
            'Invalid username. Only letters, numbers, and hyphens are allowed.'
            return
        }

        loading.value = true
        try {
            router.push({ name: 'Repo', params: { username: username.value } })
        } catch (err) {
            errorMessage.value = 'Failed to navigate. Please try again.'
        } finally {
            loading.value = false
        }
        }

        return { username, errorMessage, loading, handleSubmit }
    },
})
</script>

<template>
    <div class="home-container">
        <h1>GitHub Commit Explorer</h1>
        <form @submit.prevent="handleSubmit">
        <label for="username">GitHub Username:</label>
        <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Enter GitHub username"
            required
        />
        <span v-if="errorMessage" class="error">{{ errorMessage }}</span>
        <button type="submit">{{ loading ? "Loading..." : "Fetch Repositories" }}</button>
        </form>
    </div>
</template>
