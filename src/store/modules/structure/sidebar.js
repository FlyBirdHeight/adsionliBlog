const sidebar = {
    state: {
        cover: {
            titleName: '',
            subTitleName: '',
            createTime: '',
            tags: [],
        }
    },

    mutations: {
        SET_SIDEBAR_COVER: (state, code) => {
            state.cover = code;
        },
    },

    getters: {
        getSidebarCover(state){
            return state.cover;
        }
    }
}

export default sidebar;