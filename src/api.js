const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081/api'
// const API_BASE = 'http://localhost:8081/api'
const IMAGEKIT_PUBLIC_KEY = 'public_oaXjLRSYC16BGPDCCi3lpc5Fd64='

/**
 * Authenticated fetch wrapper.
 * Automatically attaches the JWT token from sessionStorage.
 */
export async function apiFetch(path, options = {}) {
    const token = sessionStorage.getItem('token')
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    }

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

    if (res.status === 401) {
        // Token expired / invalid — force logout
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('user')
        window.location.href = '/'
        throw new Error('Session expired')
    }

    return res
}

/**
 * Login and store JWT token + username
 */
export async function login(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.error || 'Login gagal')
    }

    sessionStorage.setItem('token', data.token)
    sessionStorage.setItem('user', data.username)
    sessionStorage.setItem('role', data.role)

    return data
}

/**
 * Get ImageKit auth token for client-side upload
 */
export async function getImageKitAuth() {
    const res = await fetch(`${API_BASE}/imagekit/auth`)

    if (!res.ok) {
        let message = 'Gagal mengambil token ImageKit'
        try {
            const data = await res.json()
            message = data.error || message
        } catch {
            // ignore JSON parse failure
        }
        throw new Error(message)
    }

    return await res.json()
}

/**
 * Upload file to ImageKit using client-side signed upload
 */
export async function uploadToImageKit(file) {
    try {
        const auth = await getImageKitAuth()
        const formData = new FormData()
        formData.append('file', file)
        formData.append('publicKey', IMAGEKIT_PUBLIC_KEY)
        formData.append('signature', auth.signature)
        formData.append('expire', auth.expire)
        formData.append('token', auth.token)
        formData.append('fileName', file.name)
        formData.append('folder', '/pengaduan')

        const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
            method: 'POST',
            body: formData,
        })

        if (!response.ok) {
            throw new Error('Upload gagal')
        }

        const result = await response.json()
        return result.url
    } catch (error) {
        console.error('ImageKit upload error:', error)
        throw error
    }
}
