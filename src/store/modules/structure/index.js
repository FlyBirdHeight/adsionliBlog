import sidebar from "./sidebar.js"
const structure = {
    /**
     * @property {*} pageList 文章列表
     * @property {*} tagList 标签列表
     */
    state: {
        pageList: undefined,
        tagList: undefined
    },
    mutations: {
        SET_PAGE_LIST: (state, code) => {
            state.pageList = code;
        },
        SET_TAG_LIST: (state, code) => {
            state.tagList = code;
        },
    },

    getters: {
        getPageList(state) {
            return state.pageList;
        },
        getTagList(state) {
            return state.tagList;
        }
    },

    modules: {
        sidebar
    }
}

export default structure;