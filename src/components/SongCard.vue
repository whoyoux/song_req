<template>
    <div>
        <b-card
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
                <p v-if="isAdminPanel==true">Numer w kolejce: <b>{{song.queue_number}}</b></p>
                <p>Dodane przez: <router-link :to="`/profile/${song.author_nickname}`"><b>{{song.author_nickname}}</b></router-link></p>
            </b-card-text>
            <b-button :href="`${song.link}`" target="_blank" variant="success">Przejdz do filmiku</b-button>
            <div class="mt-2" v-if="isUserAdmin">
                <b-button @click="deleteSongFromList(song._id)" v-if="isAdminPanel==false" variant="danger">Wyrzuć z listy</b-button>
            </div>
            <div class="mt-2" v-if="isAdminPanel==true">
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
import {mapState} from 'vuex';
import axios from 'axios';
import Swal from 'sweetalert2';
import {API_STRING} from '../config';
export default {
    name: 'SongCard',
    computed: {
    ...mapState(["isLogged", "user"]),
      isUserAdmin() {
        if(this.user.role == 'Admin') return true;
        else return false;
      },
    },
    props: {
        song: Object,
        isAdminPanel: Boolean
    },
    methods: {
      async deleteSongFromList(id) {
        Swal.fire({
          title: 'Jesteś pewny?',
          text: "Nie będziesz mógł tego przywrócić!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Tak!',
          cancelButtonText: "Nie!"
          }).then((result) => {
            if (result.isConfirmed) {
              this.deleteSong(id)
              Swal.fire(
              'Usunięte!',
              'Ta piosenka została wyrzucona z listy!',
              'success'
              )
            }
          })
      },
      async confirmSong(id) {
        try {
          const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
          };
          await axios.post(`${API_STRING}/api/song/accept`, {
            "song_id": id
          },config);
          this.$parent.fetchVideos();
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
          this.$parent.fetchVideos();
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