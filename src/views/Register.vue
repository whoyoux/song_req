<template>
  <b-container fluid>
    <b-container v-if="show">
        <h1>Rejestracja</h1>
        <b-form @submit.prevent="registerUser">
            <h4 style="color: red" v-if="error">{{error}}</h4>
            
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

            <b-form-checkbox class="mt-3 mb-3" v-model="accept">Akceptuje regulamin</b-form-checkbox>

            <b-button type="submit" variant="success">Utwórz konto!</b-button>
        </b-form>
    </b-container>
      
  </b-container>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
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
        ...mapMutations(['setUser']),
        async registerUser() {
            if(this.accept == false) {
                this.error = "Proszę zaakceptować regulamin";
                return;
            }
            try {
                let response = await axios.post("http://localhost:3000/api/user/register", this.form);
                let token = response.data.token;
                if(token) {
                    localStorage.setItem("jwt", token);
                    this.$router.push("/").catch(()=>{});
                    // Swal.fire Udane logowanie!
                    // mozna tez uzyc vue notify czy cos takiego
                    //console.log('Udana rejestracja!');
                    //this.setUser(response.data);
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
                        title: "Rejestracja udana! Sprawdź pocztę!",
                    });
                } else {
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
                        title: "Sprawdź dane!"
                    });
                    console.log('Nieudana rejestracja!');
                }
            } catch(err) {
                console.log('Error! ' + err);
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
                        title: "Ten email jest juz zajęty!"
                    });
                
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

<style>

</style>