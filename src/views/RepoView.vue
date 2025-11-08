<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGithubStore } from '@/stores/github'
import RepoList from '@/components/RepoList.vue'
import CommitList from '@/components/CommitList.vue'
import FavouriteCommits from '@/components/FavouriteCommits.vue'
import CommitDetailsModal from '@/components/CommitDetailsModal.vue'
import '@/styles/repo.css'

const githubStore = useGithubStore()
const route = useRoute()
const username = route.params.username as string

const selectedRepo = ref<string | null>(null)
const selectedCommitDetails = ref<any | null>(null)
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

async function viewCommitDetails(sha: string) {
  	selectedCommitDetails.value = await githubStore.loadCommitDetails(username, selectedRepo.value!, sha)
}

function closeDetails() {
  	selectedCommitDetails.value = null
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

		<RepoList
		v-if="githubStore.repos.length"
		:repos="githubStore.repos"
		:selectedRepo="selectedRepo"
		@select="selectRepo"
		/>

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

		<FavouriteCommits
		v-if="githubStore.favouriteCommits.length"
		:favourites="githubStore.favouriteCommits"
		/>

		<CommitDetailsModal
		v-if="selectedCommitDetails"
		:details="selectedCommitDetails"
		@close="closeDetails"
		/>
	</div>
</template>