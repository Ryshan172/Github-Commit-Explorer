<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGithubStore } from '@/stores/github'
import type { GithubCommit, CommitDetails } from '@/types/interfaces'
import RepoList from '@/components/RepoList.vue'
import CommitList from '@/components/CommitList.vue'
import FavouriteCommits from '@/components/FavouriteCommits.vue'
import '@/styles/repo.css'

// Store & route
const githubStore = useGithubStore()
const route = useRoute()
const router = useRouter()

// Local state
const selectedRepo = ref<string | null>(null)
const sortOrder = ref<'newest' | 'oldest'>('newest')

// Reactive username
const username = computed(() => route.params.username as string)

// Moving back to home page
function goHome() {
    router.push('/')
}

// Compute repoKey for favourites
const repoKey = computed(() => {
    return selectedRepo.value ? `${username.value}/${selectedRepo.value}` : ''
})

// Reset commits/repos when username changes
watch(
    () => username.value,
    async (newUsername, oldUsername) => {
        if (!newUsername) return

        // Clear previous state
        githubStore.repos = []
        githubStore.commits = []
        selectedRepo.value = null

        // Load new user's repos
        await githubStore.loadGithubRepos(newUsername)
    },
    { immediate: true } // runs immediately on mount
)

// Select a repo and load its commits
async function selectRepo(repoName: string) {
    selectedRepo.value = repoName
    await githubStore.loadGithubCommits(username.value, repoName)
    sortCommits()
}

// Sort commits by date
function sortCommits(order?: 'newest' | 'oldest') {
    if (order) sortOrder.value = order
    const sorted = [...githubStore.commits].sort((a, b) => {
        const dateA = new Date(a.commit.author.date).getTime()
        const dateB = new Date(b.commit.author.date).getTime()
        return sortOrder.value === 'newest' ? dateB - dateA : dateA - dateB
    })
    githubStore.commits = sorted
}

// Load more commits (pagination)
async function loadMoreCommits() {
    if (!selectedRepo.value) return
    await githubStore.loadGithubCommits(username.value, selectedRepo.value, true)
    sortCommits()
}

/**
 * Fetch commit details for CommitList drawer
 */
async function viewCommitDetails(
    sha: string,
    resolve: (details: CommitDetails | null) => void
) {
    if (!selectedRepo.value) {
        resolve(null)
        return
    }
    const details = await githubStore.loadCommitDetails(username.value, selectedRepo.value, sha)
    resolve(details)
}

/** Favourites handling */
function addFavourite(commit: GithubCommit) {
    if (repoKey.value) githubStore.addFavourite(commit, repoKey.value)
}

function removeFavourite(sha: string) {
    if (repoKey.value) githubStore.removeFavourite(sha, repoKey.value)
}

function isFavourite(sha: string): boolean {
    if (!repoKey.value) return false
    return githubStore.getFavourites(repoKey.value).some(c => c.sha === sha)
}

// Computed favourites for template
const currentFavourites = computed(() => {
    return repoKey.value ? githubStore.getFavourites(repoKey.value) : []
})
</script>



<template>
	<div class="repo-container">
		<div class="repo-header">
			<h1>{{ username }}’s Repositories</h1>
			<button class="home-button" @click="goHome">
				<img src="@/assets/home.png" alt="Home" />
			</button>
		</div>


		<p v-if="githubStore.errorMessage" class="error">{{ githubStore.errorMessage }}</p>

		<div class="repo-content">
			<!-- LEFT: Repository List -->
			<div class="repo-list-panel">
				<RepoList
					v-if="githubStore.repos.length"
					:repos="githubStore.repos"
					:selectedRepo="selectedRepo"
					@select="selectRepo"
				/>
			</div>

			<!-- RIGHT: Commits and Favourites -->
			<div class="commit-panel">
				<!-- Favourite Commits -->
				<FavouriteCommits
					v-if="currentFavourites.length"
					:favourites="currentFavourites"
					class="favourite-commits-box"
				/>

				<!-- Commits heading (fixed above scroll) -->
				<h2 class="commits-heading">Commits</h2>

				<!-- Scrollable commit list -->
				<div class="commits-scrollable">
					<CommitList
					v-if="githubStore.commits.length"
					:commits="githubStore.commits"
					:sortOrder="sortOrder"
					:isFavourite="isFavourite"
					@sort="sortCommits"
					@viewDetails="viewCommitDetails"
					@addFavourite="addFavourite"
					@removeFavourite="removeFavourite"
					/>

					<!-- Load more button -->
					<button
					v-if="githubStore.hasMoreCommits"
					@click="loadMoreCommits"
					class="load-more-button"
					>
					Load More
					</button>
				</div>
				</div>
		</div>
	</div>
</template>