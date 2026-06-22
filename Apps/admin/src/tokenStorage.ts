const TOKEN_STORAGE_KEY = 'ministorAdminToken';


export function getToken() {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
}


export function saveToken(token: string) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
}


export function clearToken() {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
}