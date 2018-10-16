export const isLoading = state => state.user.userLoading;
export const isError = state => state.user.userError;
export const getUser = state => state.user.user;
export const isLoggedIn = state => state.user.user !== null;
