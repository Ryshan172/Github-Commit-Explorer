# GitHub Commit Explorer App

## Overview 
A web based application which allows users to explore and track commits of a github user. 

### Features
- **Search Repositories**: Enter a GitHub username to fetch and view their public repositories.
- **View Commits**: Select a repository to list its commit details.
- **Favourites**: Mark commits as favourites and manage them.
- **Sorting**: Sort commits chronologically.

### Stack 
- Vue 3
- TypeScript
- Pinia (state management)
- Vue Router (navigation)
- Vite
- Vitest

## Run 

- Clone or download the repo.
- The following commands can be used to build, run and test the application:

```
# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build

# Test Build 
npm run preview

# Run unit tests
npm run test
```

## Functionality

### HomeView

Entry page for the GitHub Commit Explorer App. Handles user input and navigation to repositories.

**State & Refs:**
- `username`: Two-way bound input for GitHub username.  
- `errorMessage`: Displays input or store errors.  
- `loading`: Tracks submission state.  

**Methods:**
- `handleSubmit`:  
  - Validates input (non-empty, alphanumeric + hyphens).  
  - Calls Pinia store action to load repositories.  
  - Navigates to `Repo` page if successful.  
  - Handles and displays errors.

**Template:**
- Logo and app title (with secondary icon).  
- Description panel explaining app functionality.  
- Input form with validation feedback.  
- Submit button with loading state.


### RepoView

Displays a user's GitHub repositories, commits, and favourites.

**Features:**
- Left panel: Repository list.  
- Right panel: Commits and favourite commits.  
- Select a repository to load commits.  
- Sort commits by newest/oldest.  
- Mark/unmark commits as favourites.  
- Expand commit to view details.  
- Load more commits with pagination.  
- Home button to navigate back.  

**State & Props:**
- `selectedRepo`: Currently selected repository.  
- `sortOrder`: Current commit sort order.  
- `currentFavourites`: Computed favourites for the selected repo.  

**Store Integration:**
- Fetches repositories, commits, commit details, and manages favourites via GitHub store.


### CommitList

Displays a list of GitHub commits with sorting, details, and favourite functionality.

**Props:**
- `commits`: Array of GitHub commits.  
- `sortOrder`: Initial sort order (`newest` or `oldest`).  
- `isFavourite`: Function to check if a commit is a favourite.  

**Emits:**
- `sort`: Triggered when sort order changes.  
- `viewDetails`: Fetch full commit details.  
- `addFavourite`: Mark a commit as favourite.  
- `removeFavourite`: Remove a commit from favourites.  

**Features:**
- Shows commit message, author, and formatted date.  
- Inline drawer for detailed commit info (files changed, additions/deletions, patch).  
- Sort dropdown for newest/oldest.  
- Dynamic favourite buttons.  
- Handles async loading and drawer toggle.

## Contributors

- **Ryshan Ramlall** – ([GitHub](https://github.com/Ryshan172))