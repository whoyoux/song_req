<template>
  <b-container fluid>
        <h1>Potwiedzanie konta</h1>
        <b-form-input
            id="input-email"
            v-model="form.email"
            type="email"
            required
            placeholder="np. jan@kowalski.pl"
            class="w-50"
        ></b-form-input>
        <b-button variant="success" @click="confirm()">Potwierdź konto!</b-button>
  </b-container>
</template>

<script>
import Swal from 'sweetalert2';
import axios from 'axios';
export default {
    name: 'ConfirmAccount',
    data() {
        return {
            form: {
                email: '',
                confirmToken: this.$route.params.confirmToken
            },
        }
    },
    methods: {
        confirm() {
            axios.post('https://songreq.herokuapp.com/api/user/confirmAccount/', this.form)
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
                    this.$router.push("/");
                })
                .catch(() => {
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
                        title: "To konto zostało już potwierdzone!",
                    });
                });
        }
    }
}
</script>

<style>

</style>