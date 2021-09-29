const sidebar = {
    state: {
        cover: {
            titleName: '',
            subTitleName: '',
            createTime: '',
            tags: [],
        },
        tagLabel: ''
    },

    mutations: {
        SET_SIDEBAR_COVER: (state, code) => {
            state.cover = code;
        },
        SET_SIDEBAR_TAG_LABEL: (state, code) => {
            state.tagLabel = code;
        }
    },

    getters: {
        getSidebarCover(state){
            return state.cover;
        },
        getSidebarTagLabel(state){
            return state.tagLabel;
        }
    }
}

export default sidebar;