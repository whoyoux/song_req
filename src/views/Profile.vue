<template>
  <b-container fluid>
    <b-container>
      <b-container v-if="profile.message">
        <h3 style="color:red">{{profile.message}}</h3>
      </b-container>
      <b-spinner label="Loading..." class="mt-5" v-if="!show"></b-spinner>
      <div v-else>
      <b-badge v-if="profile.role === 'Admin' && !profile.message" variant="danger" class="mt-3">Admin</b-badge>
      <b-container
        v-if="!profile.message"
        id="profile"
        :class="profile.role === 'Admin' ? 'admin_border' : 'member_border mt-3'"
      >
        <b-row>
          <b-col md="12" sm="12">
            <b-avatar size="4rem"></b-avatar>
          </b-col>
          <b-col md="12" sm="12">
            <h3><b>{{profile.nickname}}</b></h3>
          </b-col>
          <b-col md="12" sm="12"></b-col>
        </b-row>
        <!-- <div>
          <h4>Ocena:</h4>
          <b-form-rating
            id="rating-10"
            readonly
            precision="2"
            v-model="profile.rates"
            stars="5"
            color="#ff8800"
            class="w-50 mx-auto"
          ></b-form-rating>
        </div> -->
        <h3>{{profile.city}}</h3>
        <h3 style="color: green" v-if="profile.isVerified">Zweryfikowany</h3>
        <div v-else>
          <h3 style="color: red">Niezweryfikowany</h3>
          <a href="#" v-if="isSameUser">
            <h6 @click="resendVerifyEmail">Wyślij email weryfikacyjny jeszcze raz</h6>
          </a>
        </div>
        
        <a href="#">
          <h6 @click="reportUser">Zgłoś użytkownika</h6>
        </a>
      </b-container>
      </div>
    </b-container>
  </b-container>
</template>

<script>
import Swal from "sweetalert2";
import axios from "axios";
import {API_STRING} from '../config';
import VueJwtDecode from "vue-jwt-decode";
export default {
  name: "Profile",
  data() {
    return {
      profile: {},
      show: false,
    };
  },
  computed: {
    isSameUser() {
      if(localStorage.getItem('jwt')) {
        if(VueJwtDecode.decode(localStorage.getItem('jwt')).nickname === this.$route.params.nickname) return true;
        else return false;
      } else return false;
    }
  },
  beforeCreate() {
    axios
      .get(`${API_STRING}/api/user/${this.$route.params.nickname}`)
      .then((data) => {
        this.profile = data.data;
        this.show=true;
      })
      .catch((err) => {
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
            icon: "error",
            title: "Wystąpił nieznany błąd! Skontaktuj się z administratorem!",
          });
          console.log(err);
          this.$router.push("/dashboard").catch(()=>{});
      });
  },
  methods: {
    async reportUser() {
      Swal.mixin({
        input: "select",
        confirmButtonText: "Dalej &rarr;",
        showCancelButton: true,
        inputOptions: {
          Profil: {
            bad_name: "Niewłaściwa nazwa",
            fake_account: "Nieprawdziwe konto",
            cheat: "Oszukiwanie",
          },
        },
        progressSteps: ["1", "2"],
      })
        .queue([
          {
            title: "Zgłaszanie użytkownika",
            text: "Wybierz typ zgłoszenia",
          },
          {
            input: "textarea",
            title: "Zgłaszanie użytkownika",
            text: "Powiedz nam więcej o tej sprawie",
            confirmButtonText: "Wyślij zgłoszenie!",
          },
        ])
        .then((result) => {
          if (result.value) {
            axios
              .post(`${API_STRING}/api/report`, {
                userTo: this.$route.params.nickname,
                userFrom: VueJwtDecode.decode(localStorage.getItem("jwt")).nickname,
                title: result.value[0],
                desc: result.value[1],
              })
              .then(() => {
                Swal.fire({
                  icon: "success",
                  title: "Udało się!",
                  text: "Zgłoszenie zostało wysłane! Zaraz się tym zajmiemy!",
                });
              })
              .catch(() => {
                Swal.fire({
                  icon: "error",
                  title: "Nieudało się!",
                  text: "Coś poszło źle! Prosze spróbować ponownie poźniej!",
                });
              });
          }
        });
    },
    async resendVerifyEmail() {
      Swal.fire({
        title: 'Jesteś tego pewny?',
        text: "Chcesz wysłać jeszcze raz email weryfikacyjny?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Tak!',
        cancelButtonText: "Nie"
      }).then((result) => {
        if (result.isConfirmed) {
          axios
              .post(`${API_STRING}/api/user/resendVerifyToken`, {
                email: VueJwtDecode.decode(localStorage.getItem("jwt")).email
              })
              .then(() => {
                Swal.fire({
                  icon: "success",
                  title: "Wysłane!",
                  text: "Sprawdź wszystkie foldery!",
                });
              })
              .catch(() => {
                Swal.fire({
                  icon: "error",
                  title: "Nieudało się!",
                  text: "Coś poszło źle! Prosze spróbować ponownie poźniej!",
                });
              });
  }
})
    }
  },
};
</script>

<style>
#profile {
  padding: 15px;
  border-radius: 13px;
}

.admin_border {
  border: 1px solid red;
}
.member_border {
  border: 1px solid #ccc;
}
</style>