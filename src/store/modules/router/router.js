const router = {
    /**
     * @property {*} pageDataRouter 文章路由列表
     */
    state: {
        pageDataRouter: undefined,
    },
    mutations: {
        SET_PAGE_DATA_ROUTER: (state, code) => {
            state.pageDataRouter = code;
        },
    },

    getters: {
        getPageDataRouter(state) {
            return state.pageDataRouter;
        },
    }
}

export default router;