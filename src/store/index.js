import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      id: "",
      nickname: "",
      email: "",
      role: ""
    },
    isLogged: false,
  },
  mutations: {
    setUser(state, data) {
      state.user.id = data._id;
      state.user.nickname = data.nickname;
      state.user.email = data.email;
      state.user.role = data.role;
    },
    resetUser(state) {
      state.user.id = "";
      state.user.nickname = "";
      state.user.email = "";
      state.user.role = "";
    },
    setLogged(state, bool) {
      state.isLogged = bool;
    },
  },
  actions: {},
  modules: {},
});
