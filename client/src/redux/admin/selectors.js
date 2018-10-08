export const isLoggedIn = state => state.admin.token !== null;
export const getToken = state => state.admin.token;
export const getEvents = state => (state.admin.events ? state.admin.events : []);
