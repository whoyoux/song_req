<template>
  <div class="home">
    <!--<h3 style="color: var(--warning)">{{this.isLogged ? 'Zalogowany' : 'Nie zalogowany'}}</h3> -->
    <b-container fluid>
      <h3 v-if="!isLogged" style="color:red">Trzeba się zalogować, aby móc dodać piosenkę!</h3>
      <b-form @submit="yt_link_submit" class="pb-5">
      <b-form-group
        id="fieldset-1"
        description="Akceptujemy tylko linki z youtube'a."
        label="Link do piosenki"
        label-for="input-1"
      >
          <b-form-input id="input-1" v-model="yt_link" class="w-50 mx-auto" trim>
        
          </b-form-input>
        </b-form-group>
        <b-button type="submit" variant="success" :disabled=!isLogged>Dodaj do listy!</b-button>
      </b-form>
      <b-spinner label="Loading..." class="mt-5" v-if="!show_song_list"></b-spinner>
      <div v-else>
        <b-card
          v-for="song in songs" v-bind:key="song._id"
          :title="`${song.videoTitle}`"
          :img-src="`${song.thumbnailUrl}`"
          img-alt="Image"
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
      </b-card>
      </div>
      
    </b-container>
    
  </div>
</template>

<script>
import axios from 'axios';
import {API_STRING} from '../config';
import {mapState} from 'vuex';
export default {
    name: 'Home',
    computed: {
    ...mapState(["isLogged"]),
    },
    data() {
      return {
        yt_link: "",
        songs: [],
        show_song_list: false,
      }
    },
    async mounted() {
      try {
        console.log('Starting get info!');
        let response = await axios.get(`${API_STRING}/api/song/list`);
        this.songs = response.data;
        console.log(this.songs);
        this.show_song_list = true;
      } catch(err) {
        console.log(err);
      }
    },
    methods: {
      yt_link_submit(e) {
        e.preventDefault();
        console.log(this.yt_link);
      }
    }
}
</script>

<style scoped>
.notConfirmed {
  border: 1px solid red;
}
.confirmed {
  border: 1px solid var(--success);
}

@media screen and (min-width: 1000px) {
  .card {
    max-width: 50vw;
  }
}
</style>