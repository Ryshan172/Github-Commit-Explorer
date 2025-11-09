// stores/githubStore.ts
import { defineStore } from 'pinia'
import type { GithubCommit, GithubState, GithubRepo, CommitDetails } from '@/types/interfaces'
import { fetchUserRepos, fetchRepoCommits, fetchCommitDetails } from '@/api/endpoints'

export const useGithubStore = defineStore<'github', GithubState, {}, {
	loadGithubRepos(username: string): Promise<void>
	loadGithubCommits(username: string, repo: string, loadMore?: boolean): Promise<void>
	loadCommitDetails(username: string, repo: string, sha: string): Promise<CommitDetails | null>
	addFavourite(commit: GithubCommit, repoKey: string): void
	removeFavourite(sha: string, repoKey: string): void
	getFavourites(repoKey: string): GithubCommit[]
}>('github', {
	state: (): GithubState => ({
		repos: [],
		commits: [],
		favouriteCommits: {}, // key = `${username}/${repoName}`
		loading: false,
		errorMessage: null,
		commitsPage: 1,           // track current page
		commitsPerPage: 10,       // commits per page
		hasMoreCommits: true,     // flag to check if more commits are available
	}),

	actions: {
		async loadGithubRepos(username: string) {
			this.loading = true
			this.errorMessage = null
			try {
				this.repos = await fetchUserRepos(username)
			} catch (err: unknown) {
				if (err instanceof Error) this.errorMessage = err.message
			} finally {
				this.loading = false
			}
		},

		async loadGithubCommits(username: string, repo: string, loadMore = false) {
			if (!loadMore) {
				this.commits = []
				this.commitsPage = 1
				this.hasMoreCommits = true
			}

			if (!this.hasMoreCommits) return

			this.loading = true
			this.errorMessage = null
			try {
				const newCommits = await fetchRepoCommits(
					username,
					repo,
					this.commitsPerPage,
					this.commitsPage
				)

				this.commits = loadMore ? [...this.commits, ...newCommits] : newCommits
				this.commitsPage += 1
				if (newCommits.length < this.commitsPerPage) {
					this.hasMoreCommits = false
				}
			} catch (err: unknown) {
				if (err instanceof Error) this.errorMessage = err.message
			} finally {
				this.loading = false
			}
		},

		async loadCommitDetails(username: string, repo: string, sha: string) {
			this.loading = true
			this.errorMessage = null
			try {
				const commit = await fetchCommitDetails(username, repo, sha)
				return commit
			} catch (err: unknown) {
				if (err instanceof Error) this.errorMessage = err.message
				return null
			} finally {
				this.loading = false
			}
		},

		/** Add favourite commit for a specific repo/user */
		addFavourite(commit: GithubCommit, repoKey: string) {
			const favs = this.favouriteCommits[repoKey] ?? []
			if (!favs.find((c: { sha: string }) => c.sha === commit.sha)) {
				this.favouriteCommits[repoKey] = [...favs, commit]
			}
		},

		/** Remove favourite commit for a specific repo/user */
		removeFavourite(sha: string, repoKey: string) {
			const favs = this.favouriteCommits[repoKey] ?? []
			this.favouriteCommits[repoKey] = favs.filter((c: { sha: string }) => c.sha !== sha)
		},

		/** Get favourites for a specific repo/user */
		getFavourites(repoKey: string): GithubCommit[] {
			return this.favouriteCommits[repoKey] ?? []
		},
	},

	// @ts-ignore
	persist: {
		key: 'github_favourites',
		paths: ['favouriteCommits'],
	},
})
