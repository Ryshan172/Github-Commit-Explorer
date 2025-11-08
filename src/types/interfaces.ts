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
    repos: GithubRepo[];
    commits: GithubCommit[];
    favouriteCommits: GithubCommit[];
    loading: boolean;
    errorMessage: string | null;
}