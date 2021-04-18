const layoutModule = {
  state: () => ({
    isSidebarOpen: false,
    showSettingsSlideover: false
  }),

  mutations: {
    TOGGLE_SIDEBAR: (state, status) => {
      state.isSidebarOpen = status !== undefined ? status : !state.isSidebarOpen
    },

    TOGGLE_SETTINGS_SLIDEOVER: (state, status) => {
      state.showSettingsSlideover = status !== undefined ? status : !state.showSettingsSlideover
    }
  }
}

export default layoutModule
