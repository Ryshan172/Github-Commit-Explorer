import axios, { AxiosError } from 'axios'
import { handleApiError } from './helpers'
import type { GithubRepo } from '@/types/interfaces';

// Contains API calls for retrieving data

// Base GitHub API URL
const api = axios.create({
	baseURL: 'https://api.github.com',
	headers: {
		Accept: 'application/vnd.github.v3+json',
	},
})


/**
 * Fetch all public repositories for a given GitHub username.
 * @param username - GitHub username to fetch repositories for
 * @returns Array of repository objects
 * @throws Error if user has no repositories or API fails
 */
export async function fetchUserRepos(username: string): Promise<GithubRepo[]> {
	try {
		const response = await api.get<GithubRepo[]>(`/users/${username}/repos`);

		// Handle case when user has no public repositories
		if (response.data.length === 0) {
			throw new Error('This user has no public repositories.');
		}

		return response.data;
	} catch (error: unknown) {
		if (error instanceof AxiosError) {
			throw new Error(handleApiError(error));
		}
		throw new Error('An unexpected error occurred.');
	}
}


/**
 * Fetch commits for a specific repository of a user.
 * @param username - GitHub username
 * @param repo - Repository name
 * @param perPage - Number of commits per page (default 10)
 * @param page - Page number for pagination (default 1)
 * @returns Array of commit objects
 * @throws Error if repository has no commits or API fails
 */
export async function fetchRepoCommits(
	username: string,
	repo: string,
	perPage = 10,
	page = 1
) {
	try {
		// Make GET request with pagination parameters
		const response = await api.get(`/repos/${username}/${repo}/commits`, {
			params: { per_page: perPage, page },
		})

		// Handle case when repository has no commits
		if (response.data.length === 0) {
			throw new Error('No commits found for this repository.')
		}

		return response.data
	} catch (error) {
		throw new Error(handleApiError(error))
	}
}


/**
 * Fetch detailed information for a single commit.
 * @param username - GitHub username
 * @param repo - Repository name
 * @param sha - Commit SHA identifier
 * @returns Commit detail object, including files changed
 * @throws Error if API request fails
 */
export async function fetchCommitDetails(
	username: string,
	repo: string,
	sha: string
) {
	try {
		// Make GET request to GitHub API for specific commit details
		const response = await api.get(`/repos/${username}/${repo}/commits/${sha}`)
		return response.data
	} catch (error) {
		throw new Error(handleApiError(error))
	}
}
