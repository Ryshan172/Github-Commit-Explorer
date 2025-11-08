<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGithubStore } from '@/stores/github'
import RepoList from '@/components/RepoList.vue'
import CommitList from '@/components/CommitList.vue'
import FavouriteCommits from '@/components/FavouriteCommits.vue'
import '@/styles/repo.css'

const githubStore = useGithubStore()
const route = useRoute()
const username = route.params.username as string

const selectedRepo = ref<string | null>(null)
const sortOrder = ref<'newest' | 'oldest'>('newest')

onMounted(async () => {
	if (githubStore.repos.length === 0) {
		await githubStore.loadGithubRepos(username)
	}
})

async function selectRepo(repoName: string) {
	selectedRepo.value = repoName
	await githubStore.loadGithubCommits(username, repoName)
	sortCommits()
}

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
 * Called by CommitList to fetch commit details when drawer is opened.
 * Returns the fetched details so CommitList can display them inline.
 */
async function viewCommitDetails(sha: string, resolve: (details: any) => void) {
	const details = await githubStore.loadCommitDetails(username, selectedRepo.value!, sha)
	resolve(details)
}


function addFavourite(commit: any) {
	githubStore.addFavourite(commit)
}

function removeFavourite(sha: string) {
	githubStore.removeFavourite(sha)
}

function isFavourite(sha: string) {
	return githubStore.favouriteCommits.some(c => c.sha === sha)
}
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
					v-if="githubStore.favouriteCommits.length"
					:favourites="githubStore.favouriteCommits"
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