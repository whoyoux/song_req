<template>
  <b-container fluid>
    <h4>
      Witamy
      <b>{{user.nickname}}</b>
    </h4>
    <h4>Twoja historia piosenek:</h4>
    <div>
      <h5>Przyjęta!</h5>
      <p>tytul sialalalalaa</p>
    </div>
    <div>
      <h5>Oddalona!</h5>
      <p>tytul sialalalalaa</p>
    </div>
  </b-container>
</template>

<script>
import VueJwtDecode from "vue-jwt-decode";
import { mapMutations } from "vuex";
export default {
  name: "Dashboard",
  data() {
    return {
      user: {},
    };
  },
  methods: {
    ...mapMutations(["resetUser", "setLogged"]),
    getUserDetails() {
      let token = localStorage.getItem("jwt");
      let decoded = VueJwtDecode.decode(token);
      this.user = decoded;
    },
  },
  created() {
    this.getUserDetails();
  },
};
</script>

<style>
</style>