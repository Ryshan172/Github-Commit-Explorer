import { vi, describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGithubStore } from '@/stores/github'
import * as api from '@/api/endpoints'
import type { GithubCommit, GithubRepo, CommitDetails } from '@/types/interfaces'

// Mock all functions from the API module to prevent real HTTP requests
vi.mock('@/api/endpoints')

describe('GithubStore', () => {
    // Reset Pinia store before each test to avoid state leaking between tests
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('loads repositories successfully', async () => {
        // Arrange: create fake repositories and mock the API
        const fakeRepos: GithubRepo[] = [
            {
                id: 1,
                name: 'repo1',
                full_name: 'octocat/repo1',
                html_url: 'https://github.com/octocat/repo1',
                description: 'desc',
                private: false,
                fork: false,
                owner: { login: 'octocat', id: 1, avatar_url: '', html_url: '' },
                stargazers_count: 0,
                forks_count: 0,
                language: 'TypeScript',
                default_branch: 'main'
            }
        ]

        const mockedFetchUserRepos = vi.mocked(api.fetchUserRepos)
        mockedFetchUserRepos.mockResolvedValue(fakeRepos)

        // Act: create store instance and call loadGithubRepos
        const store = useGithubStore()
        await store.loadGithubRepos('octocat')

        // Assert: state updated correctly
        expect(store.repos).toEqual(fakeRepos) // repositories are stored
        expect(store.errorMessage).toBeNull()  // no error occurred
        expect(store.loading).toBe(false)      // loading flag reset
    })

    it('handles API error when loading repositories', async () => {
        // Arrange: mock API to throw an error
        const mockedFetchUserRepos = vi.mocked(api.fetchUserRepos)
        mockedFetchUserRepos.mockRejectedValue(new Error('API fail'))

        // Act: create store instance and call loadGithubRepos
        const store = useGithubStore()
        await store.loadGithubRepos('baduser')

        // Assert: state reflects error
        expect(store.repos).toEqual([])           // repos remain empty
        expect(store.errorMessage).toBe('API fail') // error message stored
    })

    it('loads commits successfully', async () => {
        // Arrange: create fake commits and mock API
        const fakeCommits: GithubCommit[] = [
            {
                sha: 'abc123',
                commit: {
                    author: { name: 'octocat', email: 'octocat@github.com', date: '2025-01-01T00:00:00Z' },
                    message: 'Initial commit'
                },
                html_url: 'https://github.com/octocat/repo1/commit/abc123',
                author: { login: 'octocat', id: 1, avatar_url: '', html_url: '' }
            }
        ]

        const mockedFetchRepoCommits = vi.mocked(api.fetchRepoCommits)
        mockedFetchRepoCommits.mockResolvedValue(fakeCommits)

        // Act: load commits for a repository
        const store = useGithubStore()
        await store.loadGithubCommits('octocat', 'repo1')

        // Assert: commits stored in state correctly
        expect(store.commits).toEqual(fakeCommits)
        expect(store.errorMessage).toBeNull()
        expect(store.loading).toBe(false)
    })

    it('loads commit details successfully', async () => {
        // Arrange: create fake commit details and mock API
        const fakeCommitDetails: CommitDetails = {
            sha: 'abc123',
            commit: {
                author: { name: 'octocat', email: 'octocat@github.com', date: '2025-01-01T00:00:00Z' },
                message: 'Initial commit'
            },
            html_url: 'https://github.com/octocat/repo1/commit/abc123',
            files: [],
            stats: { total: 0, additions: 0, deletions: 0 }
        }

        const mockedFetchCommitDetails = vi.mocked(api.fetchCommitDetails)
        mockedFetchCommitDetails.mockResolvedValue(fakeCommitDetails)

        // Act: load commit details
        const store = useGithubStore()
        const details = await store.loadCommitDetails('octocat', 'repo1', 'abc123')

        // Assert: returned details match mock, no error, loading reset
        expect(details).toEqual(fakeCommitDetails)
        expect(store.errorMessage).toBeNull()
        expect(store.loading).toBe(false)
    })

    it('adds and removes favourite commits correctly', () => {
        // Arrange: create store and fake commit
        const store = useGithubStore()
        const commit: GithubCommit = {
            sha: '123',
            commit: { author: { name: '', email: '', date: '' }, message: '' },
            html_url: '',
            author: undefined
        }
        const repoKey = 'octocat/repo1'

        // Act: add commit to favourites
        store.addFavourite(commit, repoKey)

        // Assert: commit is in favourites using deep equality
        expect(store.getFavourites(repoKey)).toEqual([commit])

        // Act: remove commit from favourites
        store.removeFavourite(commit.sha, repoKey)

        // Assert: favourites list is empty
        expect(store.getFavourites(repoKey)).toHaveLength(0)
    })
})
