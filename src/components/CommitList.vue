<script setup lang="ts">
import { ref } from 'vue'
import type { GithubCommit } from '@/types/interfaces'

const props = defineProps<{
    commits: GithubCommit[]
    sortOrder: 'newest' | 'oldest'
    isFavourite: (sha: string) => boolean
}>()

const emit = defineEmits(['sort', 'viewDetails', 'addFavourite', 'removeFavourite'])
const internalSort = ref(props.sortOrder)

function formatDate(date: string) {
    return new Date(date).toLocaleString()
}

function emitSort() {
    emit('sort', internalSort.value)
}
</script>

<template>
    <section class="commits-section">
        <h2>Commits</h2>

        <label for="sort">Sort by Date:</label>
        <select id="sort" v-model="internalSort" @change="emitSort">
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        </select>

        <ul class="commit-list">
        <li v-for="commit in commits" :key="commit.sha" class="commit-item">
            <div>
            <p><strong>Message:</strong> {{ commit.commit.message }}</p>
            <p><strong>Author:</strong> {{ commit.commit.author.name }}</p>
            <p><strong>Date:</strong> {{ formatDate(commit.commit.author.date) }}</p>
            </div>
            <div class="commit-actions">
            <button @click="$emit('viewDetails', commit.sha)">View Details</button>
            <button
                v-if="!isFavourite(commit.sha)"
                @click="$emit('addFavourite', commit)"
            >
                ⭐ Favourite
            </button>
            <button
                v-else
                @click="$emit('removeFavourite', commit.sha)"
            >
                Remove
            </button>
            </div>
        </li>
        </ul>
    </section>
</template>