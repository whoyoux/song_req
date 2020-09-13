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
      state.user.id = data._id;
      state.user.nickname = data.nickname;
      state.user.email = data.email;
      console.log(state.user);
    },
    resetUser(state) {
      state.user.id = "";
      state.user.nickname = "";
      state.user.email = "";
      console.log(state.user + " R");
    },
    setLogged(state, bool) {
      state.isLogged = bool;
    },
  },
  actions: {},
  modules: {},
});
