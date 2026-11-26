const persistMiddleware = (store) => (next) => (action) => {
    const result = next(action);
    const state = store.getState();

    localStorage.setItem(
        "taskflow-auth",
        JSON.stringify(state.auth)
    );
    localStorage.setItem(
        "taskflow-ui",
        JSON.stringify(state.ui)
    );
    return result;
};

export default persistMiddleware;