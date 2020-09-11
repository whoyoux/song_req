import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      id: "",
      nickname: "",
      email: "",
    },
    isLogged: false,
  },
  mutations: {
    setUser(state, data) {
      state.user.nickname = data.nickname;
      state.user.email = data.email;
    },
    resetUser(state) {
      state.user.nickname = "";
      state.user.email = "";
    },
    setLogged(state, bool) {
      state.isLogged = bool;
    },
  },
  actions: {},
  modules: {},
});
