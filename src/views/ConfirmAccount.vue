<template>
  <b-container fluid>
        <h1>Potwiedzanie konta</h1>
        <b-spinner label="Loading..." v-if="!show"></b-spinner>
        <div v-else>
            <b-form-input
                id="input-email"
                v-model="form.email"
                type="email"
                required
                placeholder="np. jan@kowalski.pl"
                class="w-50 mx-auto mb-3"
            ></b-form-input>
            <b-button variant="success" @click="confirm()">Potwierdź konto!</b-button>
        </div>
  </b-container>
</template>

<script>
import Swal from 'sweetalert2';
import axios from 'axios';
import {API_STRING} from '../config';
export default {
    name: 'ConfirmAccount',
    data() {
        return {
            form: {
                email: '',
                confirmToken: this.$route.params.confirmToken
            },
            show: true,
        }
    },
    methods: {
        confirm() {
            this.show=false;
            axios.post(`${API_STRING}/api/user/confirmAccount/`, this.form)
                .then(() => {
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
                        title: "Udało się konto potwierdzić!",
                    });
                    this.show=true;
                    this.$router.push("/");
                })
                .catch((err) => {
                    this.show=true;
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

                    switch (err.response.status) {
                        case 500:
                            Toast.fire({
                                icon: "warning",
                                title: "To konto zostało już potwierdzone!",
                            });
                            break;
                        case 501:
                            Toast.fire({
                                icon: "warning",
                                title: "Podany email jest błędny do tokenu! Proszę podać poprawny!",
                            });
                            break;
                        case 504:
                            Toast.fire({
                                icon: "warning",
                                title: "Ten token już wygasł!",
                            });
                            break;
                        default:
                            Toast.fire({
                                icon: "error",
                                title: "Wystąpił błąd! Skontaktuj się z administratorem!",
                            });
                            console.log('BŁĄD Z WERYFIKACJĄ KONTA!');
                            console.log(`Błąd: ${err}`);
                            break;
                    }

                    
                });
        }
    }
}
</script>

<style>

</style>