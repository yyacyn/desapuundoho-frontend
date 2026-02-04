// API Configuration
const API_CONFIG = {
    // Base URL for API calls
    // For development (local)
    // BASE_URL: 'http://localhost:8081/api',

    // For production (cPanel with PHP proxy)
    BASE_URL: '/api.php',

    //koyeb
    // BASE_URL: 'https://coloured-eugenie-yashin-958e9ae4.koyeb.app/api',

    // Alternative: Direct API call (if Apache proxy works)
    // BASE_URL: '/api',

    // Alternative: With domain and port
    // BASE_URL: 'http://desapuundoho.my.id:8081/api',
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
