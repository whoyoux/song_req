<template>
  <div>
      <h1 class="mt-2">Admin Panel</h1>
      <h3 v-if="songs.length == 0">Nie ma narazie nic do zatwierdzenia :)</h3>
      <SongCard v-for="song in songs" v-bind:key="song._id" :song="song" :isAdminPanel="true" />
  </div>
</template>

<script>
import axios from 'axios';
import {API_STRING} from '../../config';
import SongCard from '@/components/SongCard.vue';
export default {
    name: 'AdminPanel',
    data() {
        return {
            songs: [],
            show_song_list: false,
        }
    },
    components: {
      SongCard
    },
    async mounted() {
        if(this.$store.state.user.role !== 'Admin') {
            this.$router.push("/").catch(()=>{});
        }
        this.fetchVideos();
    },
    methods: {
        async fetchVideos() {
        try {
          let response = await axios.get(`${API_STRING}/api/song/unconfirmed_list`);
          this.songs = response.data;
          this.show_song_list = true;
        } catch(err) {
          console.log(err);
        }
      },
      async confirmSong(id) {
        try {
          const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
          };
          await axios.post(`${API_STRING}/api/song/accept`, {
            "song_id": id
          },config);
          this.fetchVideos();
        } catch(err) {
          console.log(err);
        }
      },
      async deleteSong(id) {
        try{
          const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
          };
          await axios.post(`${API_STRING}/api/song/delete`, {
            "song_id": id
          },config);
          this.fetchVideos();
        } catch(err) {
          console.log(err);
        }
      },
    }
}
</script>

<style>
@media screen and (min-width: 1000px) {
  .card {
    max-width: 30vw;
  }
}
</style>