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
