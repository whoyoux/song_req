<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="success">
    <b-navbar-brand to="/">Radio</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav v-if="user.role === 'Admin'">
        <b-nav-item to="/admin_panel">Admin Panel</b-nav-item>
        <b-nav-item to="/admin_player">Admin Player</b-nav-item>
        <b-nav-item to="/admin_user_panel">Admin User Panel</b-nav-item>
      </b-navbar-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        
        <b-nav-item-dropdown right v-if="isLogged">
          <!-- Using 'button-content' slot -->
          <template v-slot:button-content>
            <em>
              {{user.nickname}}
              <b-icon icon="person"></b-icon>
            </em>
          </template>
          <b-dropdown-item to="/">Dodaj piosenke</b-dropdown-item>
          <!-- <b-dropdown-item to="/dashboard">Panel sterowania</b-dropdown-item> -->
          <b-dropdown-item :to="`/profile/${user.nickname}`">Profil</b-dropdown-item>
          <b-dropdown-item to="/admin_panel" v-if="user.role === 'Admin'">Panel</b-dropdown-item>
          <b-dropdown-item to="/admin_player" v-if="user.role === 'Admin'">Player</b-dropdown-item>
          <b-dropdown-item href="#" variant="danger" @click="logOutUser">Wyloguj się</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown right v-else>
          <!-- Using 'button-content' slot -->
          <template v-slot:button-content>
            <em>Użytkownik niezalogowany</em>
          </template>
          <b-dropdown-item to="/login">Zaloguj się!</b-dropdown-item>
          <b-dropdown-item to="/register">Stwórz konto!</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
    <router-view />
  </div>
</template>
<script>
import Swal from 'sweetalert2';
import VueJwtDecode from "vue-jwt-decode";
import { mapMutations, mapState } from "vuex";
export default {
  name: "App",
  computed: {
    ...mapState(["isLogged", "user"]),
  },
  methods: {
    ...mapMutations(["setLogged", "setUser", "resetUser"]),
    logOutUser() {
      this.resetUser();
      localStorage.removeItem("jwt");
      this.setLogged(false);
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        onOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: "warning",
        title: "Udało się wylogować!",
      });
      this.$router.push("/").catch(()=>{});
    },
  },
  mounted() {
    if (localStorage.getItem("jwt")) {
      let token = localStorage.getItem("jwt");
      let decoded = VueJwtDecode.decode(token);
      this.setUser(decoded);
      this.setLogged(true);
    } else {
      this.setLogged(false);
    }
  },
};
</script>
<style>
#app {
  text-align: center;
}
</style>
