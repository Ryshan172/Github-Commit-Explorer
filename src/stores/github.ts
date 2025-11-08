// stores/githubStore.ts
import { defineStore } from 'pinia';
import type { GithubCommit, GithubState } from '../types/interfaces';
import { fetchUserRepos, fetchRepoCommits, fetchCommitDetails } from '../api/endpoints'


// Define and export the Pinia store
export const useGithubStore = defineStore('github', {
    // Initial state of the store
    state: (): GithubState => ({
        repos: [],
        commits: [],
        favouriteCommits: [],
        loading: false,
        errorMessage: null,
    }),

    // Actions contain methods to modify state or perform async API calls
    actions: {
        /**
         * Fetch all repositories for a given GitHub username.
         * This is triggered from the Home page after the user enters a username.
         */
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

        /**
         * Fetch commits for a specific repository of a user.
         * Called when navigating to the repository details page.
         */
        async loadGithubCommits(username: string, repo: string) {
            this.loading = true
            this.errorMessage = null
            try {
                this.commits = await fetchRepoCommits(username, repo)
            } catch (err: unknown) {
                if (err instanceof Error) this.errorMessage = err.message
            } finally {
                this.loading = false
            }
        },

        /**
         * Fetch detailed information for a specific commit using its SHA.
         * Useful for displaying commit details in a modal or details view.
         */
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

        /**
         * Add a commit to the list of favourites.
         * Prevents duplicates using a simple SHA check.
         */
        addFavourite(commit: GithubCommit) {
            const exists = this.favouriteCommits.find(c => c.sha === commit.sha)
            if (!exists) this.favouriteCommits.push(commit)
        },

        /**
         * Remove a commit from the list of favourites by its SHA.
         */
        removeFavourite(sha: string) {
            this.favouriteCommits = this.favouriteCommits.filter(c => c.sha !== sha)
        },
    },
})