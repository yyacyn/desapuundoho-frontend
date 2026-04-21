// API Configuration
const API_CONFIG = {
    // Base URL for API calls
    // For development (local)
    // BASE_URL: 'http://localhost:8081/api',

    // For production (cPanel with PHP proxy)
    // BASE_URL: '/api.php',

    // production (with .htaccess rewrite to api.php)
    BASE_URL: '/api' || 'http://localhost:8081/api',

    // leapcell (DEPRECATED)
    // BASE_URL: 'https://desapuundoho-backend-yyacyn8027-q3bmatch.apn.leapcell.dev/api',
}

// Helper function to make API calls
export const apiCall = async (endpoint) => {
    const url = API_CONFIG.BASE_URL.includes('api.php')
        ? `${API_CONFIG.BASE_URL}?path=${endpoint}`
        : `${API_CONFIG.BASE_URL}/${endpoint}`

    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`)
    }

    return response.json()
}

export default API_CONFIG
