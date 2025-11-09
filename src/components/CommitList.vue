<script setup lang="ts">
import { ref } from 'vue'
import type { GithubCommit } from '@/types/interfaces'
import '@/styles/commits.css'

const props = defineProps<{
    commits: GithubCommit[]
    sortOrder: 'newest' | 'oldest'
    isFavourite: (sha: string) => boolean
}>()

const emit = defineEmits(['sort', 'viewDetails', 'addFavourite', 'removeFavourite'])

// Local UI state
const internalSort = ref(props.sortOrder)
const openCommitSha = ref<string | null>(null)
const commitDetails = ref<any | null>(null)
const isLoading = ref(false)

function formatDate(date: string) {
    return new Date(date).toLocaleString()
}

function emitSort() {
    emit('sort', internalSort.value)
}

async function toggleDetails(commit: GithubCommit) {
    if (openCommitSha.value === commit.sha) {
        // Close details
        openCommitSha.value = null
        commitDetails.value = null
    } else {
        // Open new details
        openCommitSha.value = commit.sha
        commitDetails.value = null
        isLoading.value = true

        // Wait for parent to fetch details
        const detailsPromise = new Promise<any>((resolve) => {
        emit('viewDetails', commit.sha, resolve)
        })

        commitDetails.value = await detailsPromise
        isLoading.value = false
    }
}
</script>

<template>
    <section class="commits-section">
        <div class="commits-header">
        <h2>Commits</h2>
        <label for="sort">Sort:</label>
        <select id="sort" v-model="internalSort" @change="emitSort">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
        </select>
        </div>

        <ul class="commit-list">
        <li v-for="commit in commits" :key="commit.sha" class="commit-item">
            <div class="commit-main">
            <div>
                <p><strong>Message:</strong> {{ commit.commit.message }}</p>
                <p><strong>Author:</strong> {{ commit.commit.author.name }}</p>
                <p><strong>Date:</strong> {{ formatDate(commit.commit.author.date) }}</p>
            </div>
            <div class="commit-actions">
                <button @click="toggleDetails(commit)">
                {{ openCommitSha === commit.sha ? 'Hide Details' : 'View Details' }}
                </button>
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
            </div>

            <!-- Inline Drawer -->
            <transition name="slide-fade">
                <div v-if="openCommitSha === commit.sha" class="commit-details-drawer">
                    <div v-if="isLoading">Loading details...</div>

                    <div v-else-if="commitDetails">
                    <!-- Number of files changed -->
                    <p><strong>Files changed:</strong> {{ commitDetails.files.length }}</p>

                    <h4>Changes per file</h4>
                    <ul>
                        <li v-for="file in commitDetails.files" :key="file.filename">
                        <p>
                            <strong>{{ file.filename }}</strong> — {{ file.changes }} changes
                        </p>

                        <!-- Show additions and deletions -->
                        <p>
                            +{{ file.additions }} / -{{ file.deletions }}
                        </p>

                        <!-- Show patch/diff if available -->
                        <pre v-if="file.patch" class="file-patch">{{ file.patch }}</pre>
                        </li>
                    </ul>
                    </div>

                    <div v-else>
                    <p>No details available for this commit.</p>
                    </div>
                </div>
            </transition>
        </li>
        </ul>
    </section>
</template>