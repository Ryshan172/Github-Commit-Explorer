import axios from 'axios'

// Helper Functions

/**
 * Converts an API error (Axios or otherwise) into a readable message.
 * @param error - The error object thrown by axios or other sources
 * @returns A human-readable string describing the error
 */
export function handleApiError(error: unknown): string {
	// Check if the error is an Axios error
	if (axios.isAxiosError(error)) {
		const status = error.response?.status

		//  GitHub API status codes
		// Not found error
		if (status === 404) return 'User or repository not found.'
		// Rate limit
		if (status === 403) return 'Rate limit exceeded. Please try again later.'

		// If the API provides a message, use it; otherwise, fallback
		return error.response?.data?.message || 'Unexpected API error occurred.'
	}

	// Handling non-Axios errors
	return 'An unknown error occurred.'
}
