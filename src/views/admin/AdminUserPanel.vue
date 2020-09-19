<template>
  <div>
      <h3 class="mt-2">Admin User Panel</h3>
      <b-spinner label="Loading..." class="mt-5" v-if="!showUsersList"></b-spinner>
      <div v-else>
          <AdminUserCard v-for="user in users" v-bind:key="user._id" :user="user"/>
      </div>
  </div>
</template>

<script>
import axios from 'axios';
import {API_STRING} from '../../config';
import AdminUserCard from '@/components/AdminUserCard.vue';

export default {
    name: 'AdminUserPanel',
    data() {
        return {
            users: [],
            showUsersList: false
        }
    },
    components: {
        AdminUserCard
    },
    async mounted() {
        if(this.$store.state.user.role !== 'Admin') {
            this.$router.push("/").catch(()=>{});
        }
        this.getUsers();
    },
    methods: {
        async getUsers() {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
                };
                let response = await axios.get(`${API_STRING}/api/user/all`,config);
                this.users = response.data;
                this.showUsersList = true;
            } catch(err) {
                console.log(err);
                this.showUsersList = true;
            }
        }
    }
}
</script>

<style>
</style>