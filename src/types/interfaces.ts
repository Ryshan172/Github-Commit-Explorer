export interface GithubUser {
	login: string;
	id: number;
	avatar_url: string;
	html_url: string;
}

export interface GithubRepo {
	id: number;
	name: string;
	full_name: string;
	html_url: string;
	description: string | null;
	private: boolean;
	fork: boolean;
	owner: GithubUser;
	stargazers_count: number;
	forks_count: number;
	language: string | null;
	license?: {
		key: string;
		name: string;
		spdx_id: string;
		url: string | null;
	};
	default_branch: string;
}

export interface GithubCommit {
	sha: string;
	commit: {
		author: {
			name: string;
			email: string;
			date: string;
		};
		message: string;
	};
	html_url: string;
	author?: GithubUser;
}

export interface GithubState {
	repos: GithubRepo[]
	commits: GithubCommit[]
	favouriteCommits: Record<string, GithubCommit[]> // key = `${username}/${repo}`
	loading: boolean
	errorMessage: string | null
	commitsPage: number
	commitsPerPage: number
	hasMoreCommits: boolean
}


export interface CommitFile {
	filename: string;
	additions: number;
	deletions: number;
	changes: number;
	status: 'added' | 'modified' | 'removed';
	raw_url: string;
	blob_url: string;
	patch?: string; // optional diff snippet
}

export interface CommitStats {
	total: number;
	additions: number;
	deletions: number;
}

export interface CommitDetails {
	sha: string;
	commit: {
		author: {
			name: string;
			email: string;
			date: string;
		};
		message: string;
	};
	html_url: string;
	author?: GithubUser;
	files: CommitFile[];
	stats: CommitStats;
}

export interface RepoListProps {
	repos: GithubRepo[];
	selectedRepo: string | null;
}

export interface CommitListProps {
	commits: GithubCommit[];
	sortOrder: 'newest' | 'oldest';
	isFavourite: (sha: string) => boolean;
}

export interface FavouriteCommitsProps {
	favourites: GithubCommit[];
}
