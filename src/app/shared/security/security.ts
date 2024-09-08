export function getJwtFromStorage() {
    return sessionStorage.getItem('Authorization');
}
