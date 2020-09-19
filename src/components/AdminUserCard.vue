<template>
    <div 
        class="user"
        :class="user.role === 'Admin' ? 'admin' : ''"
    >
        <h5>{{user.nickname}}</h5>
        <h6>{{user.email}}</h6>
        {{user._id}}
        <h6 style="color: green" v-if="user.isVerified">Zweryfikowany</h6>
        <h6 style="color: red" v-else>Niezweryfikowany</h6>
        <b-button
            :class="reportsVisible ? null : 'collapsed'"
            :aria-expanded="reportsVisible ? 'true' : 'false'"
            aria-controls="collapse-reports"
            @click="reportsVisible = !reportsVisible"
            v-if="user.reports.length > 0"
            variant="primary"
        >
            Pokaż zgłoszenia
        </b-button>
        <b-collapse id="collapse-reports" v-model="reportsVisible" class="mt-2" v-if="user.reports.length > 0">
            <div v-for="report in user.reports" v-bind:key="report._id">
                {{report.title}}
            </div>
        </b-collapse>
        <div>
            <b-button variant="danger" @click="deleteUser()" class="mt-2">Usuń to konto</b-button>
        </div>
        
    </div>
</template>

<script>
import Swal from 'sweetalert2';
import axios from 'axios';
import {API_STRING} from '../config';
export default {
    name: 'AdminUserCard',
    props: {
        user: Object
    },
    data() {
        return {
            reportsVisible: false
        }
    },
    methods: {
        async deleteUser() {
            Swal.fire({
                title: 'Jesteś pewny?',
                text: "Nie będziesz mógł tego przywrócić!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Tak!',
                cancelButtonText: "Nie!",
                focusConfirm: false,
                
            }).then((result) => {
                if (result.isConfirmed) {
                    
                Swal.fire({
                    title: 'Ale na pewno?',
                    text: "Nie będzie już odwrotu!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Tak!',
                    cancelButtonText: "Nie!",
                    focusConfirm: false,  
                }).then(result2 => {
                    if(result2.isConfirmed) {
                        try {
                        const config = {
                            headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
                        };

                        axios.post(`${API_STRING}/api/user/delete`, {
                            user_id: this.user._id
                        }, config).then(() => {
                            this.$parent.getUsers();
                            Swal.fire(
                                'Usunięte!',
                                'Użytkownik został usunięty!',
                                'success'
                            );
                        })
                        .catch((error) => {
                            this.$parent.getUsers();
                            console.log(error);
                            Swal.fire(
                                'Wystąpił błąd!',
                                'Użytkownik nie został usunięty! Sprawdź logi!',
                                'error',
                            );
                        });
                        
                    } catch(err) {
                        console.log(err);
                        Swal.fire(
                            'Wystąpił błąd!',
                            'Użytkownik nie został usunięty! Sprawdź logi!',
                            'error',
                        );
                    }
                    }
                })
                    
                }
          })
        }
    }
}
</script>

<style>
.user {
    width: 50vw;
    height: auto;
    border: 1px solid #eee;
    padding: 15px;
    margin: 15px;
    border-radius: 4px;
    margin-left: auto;
    margin-right: auto;
}
.admin {
    border: 1px solid red;
}

router-link::hover {
    text-decoration: none; 
}
</style>