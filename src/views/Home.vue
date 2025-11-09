<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import '@/styles/home.css'
import { useGithubStore } from '@/stores/github'

// Import GitHub icon from assets
import githubIcon from '@/assets/github_icon.png'

const username = ref('')
const errorMessage = ref('')
const loading = ref(false)
const router = useRouter()
const githubStore = useGithubStore()

const handleSubmit = async () => {
    errorMessage.value = ''

    // Validate empty input
    if (!username.value.trim()) {
        errorMessage.value = 'Please enter a GitHub username.'
        return
    }

    // Validate allowed characters
    const usernamePattern = /^[a-zA-Z0-9-]+$/
    if (!usernamePattern.test(username.value)) {
        errorMessage.value = 'Invalid username. Only letters, numbers, and hyphens are allowed.'
        return
    }

    loading.value = true

    try {
        // Call the Pinia store action instead of API directly
        await githubStore.loadGithubRepos(username.value.trim())

        // Check for store-level error
        if (githubStore.errorMessage) {
            errorMessage.value = githubStore.errorMessage
            return
        }

        // Navigate to Repo page if successful
        router.push({ name: 'Repo', params: { username: username.value.trim() } })
    } catch (err: unknown) {
        if (err instanceof Error) {
            errorMessage.value = err.message
        } else {
            errorMessage.value = 'An unexpected error occurred.'
        }
    } finally {
        loading.value = false
    }

}
</script>

<template>
    <div class="home-container">
        <img src="@/assets/github_icon.png" alt="GitHub Logo" class="github-icon" />
        <h1 class="title">GitHub Commit Explorer App</h1>
        <form @submit.prevent="handleSubmit">
            <input
                id="username"
                v-model="username"
                type="text"
                placeholder="Enter GitHub username"
                required
            />
            <span v-if="errorMessage" class="error">{{ errorMessage }}</span>
            <button type="submit" :disabled="loading">
                {{ loading ? 'Loading...' : 'Fetch Repositories' }}
            </button>
        </form>
    </div>
</template>
