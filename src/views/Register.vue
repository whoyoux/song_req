<template>
  <b-container fluid>
    <b-container>
      <h1>Rejestracja</h1>
      <b-spinner label="Loading..." v-if="!show"></b-spinner>
      <b-form @submit.prevent="registerUser" v-else>
        <h4 style="color: red" v-if="error">{{ error }}</h4>

        <b-form-group
          id="input-group-nickname"
          label="Nickname:"
          label-for="input-nickname"
        >
          <b-form-input
            id="input-nickname"
            v-model="form.nickname"
            type="text"
            required
            placeholder="Nickname"
          ></b-form-input>
        </b-form-group>

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

        <b-form-group
          id="input-group-pass"
          label="Hasło:"
          label-for="input-pass"
        >
          <b-form-input
            id="input-pass"
            v-model="form.password"
            type="password"
            required
            placeholder="Hasło"
            :state="pass_validation"
          ></b-form-input>
          <b-form-invalid-feedback :state="pass_validation">
            Hasło musi mieć od 5 do 15 znaków i muszą się zgadzać!
          </b-form-invalid-feedback>
          <b-form-valid-feedback :state="pass_validation">
            Hasło jest w porządku!
          </b-form-valid-feedback>
        </b-form-group>

        <b-form-group
          id="input-group-pass2"
          label="Potwierdź hasło:"
          label-for="input-pass2"
        >
          <b-form-input
            id="input-pass2"
            v-model="password2"
            type="password"
            required
            placeholder="Potwierdź hasło"
            :state="pass_validation"
          ></b-form-input>
          <b-form-invalid-feedback :state="pass_validation">
            Hasło musi mieć od 5 do 15 znaków i muszą się zgadzać!
          </b-form-invalid-feedback>
          <b-form-valid-feedback :state="pass_validation">
            Hasło jest w porządku!
          </b-form-valid-feedback>
        </b-form-group>

        <b-form-checkbox class="mt-3 mb-3" v-model="accept"
          >Akceptuje regulamin</b-form-checkbox
        >

        <b-button type="submit" variant="success">Utwórz konto!</b-button>
      </b-form>
    </b-container>
  </b-container>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import {API_STRING} from '../config';
import {mapMutations} from 'vuex';
export default {
    name: 'Register',
    data() {
        return {
            form: {
                nickname: '',
                email: '',
                password: '',
            },
            password2: '',
            show: true,
            accept: false,
            error: ''
        }
    },
    computed: {
        pass_validation() {
            return this.form.password.length >= 5 && this.form.password.length < 15 && this.form.password === this.password2
        }
    },
    mounted() {
        this.resetForm();
        this.error = '';
    },
    methods: {
        ...mapMutations(["setUser", "setLogged"]),
        async registerUser() {
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

            if(this.accept == false) {
                Toast.fire({
                    icon: "warning",
                    title: "Proszę zaakceptować regulamin!",
                });
                return;
            }
            const regex_nickname=/[ęóąśłżźćńĘÓĄŚŁŻŹĆŃ]/i;
            if(this.form.nickname.length < 3 || this.form.nickname.length > 10) {
                Toast.fire({
                    icon: "warning",
                    title: "Nazwa musi mieć od 3 znaków do 10!",
                });
                return;
            }

            if(regex_nickname.test(this.form.nickname)) {
                Toast.fire({
                    icon: "warning",
                    title: "Nazwa nie może zawierać specjalnych znaków!",
                });
                return;
            }

            // if(!regex_email.test(this.form.email)) {
            //     Toast.fire({
            //             icon: "warning",
            //             title: "Podaj prawdziwy email!",
            //         });
            //         return;
            // }
            
            try {
                this.show = false;
                let response = await axios.post(`${API_STRING}/api/user/register`, this.form);
                let token = response.data.token;
                if(token) {
                    localStorage.setItem("jwt", token);
                    await this.setLogged(true);
                    await this.setUser(response.data.data);
                    this.$router.push("/").catch(()=>{});
                    Toast.fire({
                        icon: "success",
                        title: "Rejestracja udana! Sprawdź pocztę!",
                    });
                } else {
                    Toast.fire({
                        icon: "error",
                        title: "Sprawdź dane!"
                    });
                    console.log('Nieudana rejestracja!');
                }
            } catch(err) {
                //console.log(err.response.status);
                this.show = true;
                console.log('Error! ' + err);
                switch (err.response.status) {
                    case 400:
                        Toast.fire({
                            icon: "error",
                            title: "Nieznany błąd! Skontaktuj się z administratorem! Sprawdź logi!"
                        });
                        break;
                    case 401:
                        Toast.fire({
                            icon: "error",
                            title: "Ta nazwa jest już zajęta!"
                        });
                        break;
                    case 409:
                        Toast.fire({
                            icon: "error",
                            title: "Ten email jest juz zajęty!"
                        });
                        break;
                    default:
                        Toast.fire({
                            icon: "error",
                            title: "Nieznany błąd! Skontaktuj się z administratorem! Sprawdź logi!"
                        });
                        console.log(`Wystąpił nieznany error! Proszę zgłosić się do administratora!`);
                        console.log(`Błąd: ${err}`);
                        break;
                }
            }
        },
        resetForm() {
            this.nickname = '';
            this.email = '';
            this.password = '';
            this.password2 = '';
            this.show = false;
            this.$nextTick(() => {
                this.show = true;
            })
        }
    }
}
</script>

<style></style>
