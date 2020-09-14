<template>
  <div>
      <h1>Admin panel</h1>
      <h3 v-if="songs.length == 0">Nie ma narazie nic do zatwierdzenia :)</h3>
      <b-card
          v-for="song in songs" v-bind:key="song._id"
          :title="`${song.videoTitle}`"
          :img-src="`${song.thumbnailUrl}`"
          img-alt="Image"
          img-height="275"
          img-width="300"
          img-top
          tag="article"
          class="mx-auto w-auto mb-4 card"
          :class="song.isConfirmed === true ? 'confirmed' : 'notConfirmed'"
        >
        <b-card-text>
          <p>Autor: <b>{{song.videoAuthor}}</b></p>
          <p>Numer w kolejce: <b>{{song.queue_number}}</b></p>
          <p>Dodane przez: <b>{{song.author_nickname}}</b></p>
        </b-card-text>
        <b-button :href="`${song.link}`" target="_blank" variant="success">Przejdz do filmiku</b-button>
        <div class="mt-2">
          <b-button @click="confirmSong(song._id)" variant="success" class="mr-2">Akceptuj</b-button>
          <b-button @click="deleteSong(song._id)" variant="danger">Odrzuć</b-button>
        </div>
        <!-- <div v-else-if="isUserAdmin">
          <h5 style="color: var(--danger)" class="mt-4">Wystąpił błąd! Jeżeli się da to należy odrzucić!</h5>
        </div> -->
      </b-card>
  </div>
</template>

<script>
import axios from 'axios';
import {API_STRING} from '../config';
export default {
    name: 'AdminPanel',
    data() {
        return {
            songs: [],
            show_song_list: false,
        }
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