<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useGithubStore } from '@/stores/github'
import type { GithubCommit, CommitDetails } from '@/types/interfaces'
import RepoList from '@/components/RepoList.vue'
import CommitList from '@/components/CommitList.vue'
import FavouriteCommits from '@/components/FavouriteCommits.vue'
import '@/styles/repo.css'

// Store & route
const githubStore = useGithubStore()
const route = useRoute()
const username = route.params.username as string

// Local state
const selectedRepo = ref<string | null>(null)
const sortOrder = ref<'newest' | 'oldest'>('newest')

// Compute repoKey for favourites
const repoKey = computed(() => {
	return selectedRepo.value ? `${username}/${selectedRepo.value}` : ''
})

// Fetch repos on mount if not already loaded
onMounted(async () => {
	if (githubStore.repos.length === 0) {
		await githubStore.loadGithubRepos(username)
	}
})

// Select a repo and load its commits
async function selectRepo(repoName: string) {
	selectedRepo.value = repoName
	await githubStore.loadGithubCommits(username, repoName)
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
	const details = await githubStore.loadCommitDetails(username, selectedRepo.value, sha)
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
		<h1>{{ username }}’s Repositories</h1>

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

				
				<!-- Commits List -->
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
			</div>
		</div>
	</div>
</template>