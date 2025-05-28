export function isAdminRole(role: string | undefined): boolean {
    return role === 'ADMIN' || role === 'SUPER_ADMIN';
}