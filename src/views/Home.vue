<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import '@/styles/home.css'
import { fetchUserRepos } from '@/api/endpoints'
import type { GithubRepo } from '@/types/interfaces'

const username = ref('')
const errorMessage = ref('')
const loading = ref(false)
const router = useRouter()

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
        errorMessage.value =
        'Invalid username. Only letters, numbers, and hyphens are allowed.'
        return
    }

    loading.value = true

    try {
        loading.value = true;

        // Fetch user repositories
        const repos: GithubRepo[] = await fetchUserRepos(username.value.trim());

        // TODO: store in Pinia
        // repoStore.setRepos(repos);

        // Navigate to Repo page with username param
        router.push({ name: 'Repo', params: { username: username.value.trim() } });
    } catch (err: unknown) {
        if (err instanceof Error) {
            errorMessage.value = err.message;
        } else {
            errorMessage.value = 'An unexpected error occurred.';
        }
    } finally {
        loading.value = false;
    }

}
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
        <button type="submit">{{ loading ? 'Loading...' : 'Fetch Repositories' }}</button>
        </form>
    </div>
</template>
