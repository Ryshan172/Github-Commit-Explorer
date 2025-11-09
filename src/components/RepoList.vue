/**
 * Displays a list of GitHub repositories for selection.
 *
 * Props:
 * - repos: Array of GithubRepo objects to display.
 * - selectedRepo: Currently selected repository name.
 *
 * Emits:
 * - 'select': Triggered when a repository is clicked, passing the repo name.
 *
 * Usage:
 * - Used in the main repository view to allow the user to choose a repository and load its commits.
 */

<script setup lang="ts">
import type { GithubRepo } from '@/types/interfaces'

defineProps<{
    repos: GithubRepo[]
    selectedRepo: string | null
}>()

defineEmits(['select'])
</script>

<template>
    <section class="repos-section">
        <h2>Select a Repository</h2>
        <ul class="repo-list">
        <li
            v-for="repo in repos"
            :key="repo.id"
            @click="$emit('select', repo.name)"
            :class="{ active: repo.name === selectedRepo }"
        >
            <strong>{{ repo.name }}</strong>
            <p>{{ repo.description || 'No description available.' }}</p>
        </li>
        </ul>
    </section>
</template>
