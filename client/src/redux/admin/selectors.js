export const isLoggedIn = state => state.admin.token !== null;
export const getToken = state => state.admin.token;
