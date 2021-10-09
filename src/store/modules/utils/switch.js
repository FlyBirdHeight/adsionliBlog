const switchPage = {
    /**
     * @property {Number} currentPage 当前文章在文章列表中的下标位置
     * @property {Number} prePage 上一篇文章的位置下标
     * @property {Number} nextPage 下一篇文章的位置下表
     */
    state: {
        currentPage: undefined,
        prePage: undefined,
        nextPage: undefined 
    },

    mutations: {
        SET_CURRENT_PAGE: (state, code) => {
            state.currentPage = code;
        },
        SET_PRE_PAGE: (state, code) => {
            state.prePage = code;
        },
        SET_NEXT_PAGE: (state, code) => {
            state.nextPage = code;
        }
    },

    getters: {
        getCurrentPage(state){
            return state.currentPage;
        },
        getPrePage(state){
            return state.prePage;
        },
        getNextPage(state){
            return state.nextPage;
        }
    }
}

export default switchPage;