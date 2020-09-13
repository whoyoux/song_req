<template>
  <b-container fluid>
    <b-container>
      <h1>Login</h1>
      <b-spinner label="Loading..." v-if="!show"></b-spinner>
      <b-form @submit.prevent="loginUser" v-else>
        <!--<h4 style="color: red" v-if="error">{{error}}</h4> -->

        <b-form-group
          id="input-group-email"
          label="Adres email:"
          label-for="input-email"
          description="Spokojnie, nikomu nie pokażemy twojego adresu email."
        >
          <b-form-input
            id="input-email"
            v-model="form.email"
            type="email"
            required
            placeholder="Adres email"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-pass" label="Hasło:" label-for="input-pass">
          <b-form-input
            id="input-pass"
            v-model="form.password"
            type="password"
            required
            placeholder="Hasło"
          ></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="success">Zaloguj się!</b-button>
        <b-button type="button" variant="danger" to="/register" class="ml-2">Utwórz konto!</b-button>
      </b-form>
    </b-container>
  </b-container>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import { mapMutations } from "vuex";
import {API_STRING} from '../config';
export default {
  name: "Login",
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      show: true,
      error: "",
      logged: false,
    };
  },
  created() {
    this.error = "";
  },
  methods: {
    ...mapMutations(["setUser", "setLogged"]),
    async loginUser() {
      try {
        this.show = false;
        let response = await axios.post(
          `${API_STRING}/api/user/login`,
          this.form
        );
        let token = response.data.token;
        if (token) {
          await this.setLogged(true);
          await this.setUser(response.data.user);

          localStorage.setItem("jwt", token);
          
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
            icon: "success",
            title: "Logowanie udane",
          });
          this.show = true;
          this.$router.push("/dashboard").catch(()=>{});
        }
      } catch (err) {
        console.log("Error! " + err);
        this.show = true;
        this.error = "Błędne dane do logowania!";
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
          title: "Błędne dane logowania!",
        });
      }
    },
  },
};
</script>

<style>
</style>