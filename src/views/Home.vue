<template>
  <div class="home">
    <!--<h3 style="color: var(--warning)">{{this.isLogged ? 'Zalogowany' : 'Nie zalogowany'}}</h3> -->
    <b-container fluid>
      <h3 v-if="!isLogged" style="color:red">Trzeba się zalogować, aby móc dodać piosenkę!</h3>
      <b-spinner label="Loading..." class="mt-5" v-if="!show_song_add"></b-spinner>
      <div class="pb-5" v-else>
      <b-form-group
        id="fieldset-1"
        description="Akceptujemy tylko linki z youtube'a."
        label="Link do piosenki"
        label-for="input-1"
      >
          <b-form-input id="input-1" v-model="yt_link" class="w-50 mx-auto" trim>
        
          </b-form-input>
        </b-form-group>
        
      <vue-recaptcha 
        sitekey="6Lf2uMsZAAAAANl2t_y3byQZU87Uz9eGsjxYaCzu"
        ref="recaptcha"
        @verify="onVerify"
        @expired="onExpired"
        class="g-recaptcha"
      ></vue-recaptcha>
      <br />
        <b-button type="submit" variant="success" @click="addSongToList" :disabled=!isLogged>Dodaj do listy!</b-button>
      </div>
      <b-spinner label="Loading..." class="mt-5" v-if="!show_song_list"></b-spinner>
      <h4 v-if="songs.length == 0 && show_song_list">Nie ma narazie żadnych piosenek na liście</h4>
      <div v-else>
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
      </b-card>
      </div>
      
    </b-container>
    
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import {API_STRING} from '../config';
import {mapState} from 'vuex';
import VueRecaptcha from 'vue-recaptcha';
export default {
    name: 'Home',
    computed: {
    ...mapState(["isLogged", "user"]),
    },
    components: {
      VueRecaptcha
    },
    data() {
      return {
        yt_link: "",
        songs: [],
        show_song_list: false,
        show_song_add: true,
        isCaptcha: false,
        captchaToken: ''
      }
    },
    async mounted() {
      this.fetchVideos();
    },
    methods: {
      onVerify: function (response) {
        this.isCaptcha = true;
        this.captchaToken = response;
      },
      onExpired: function () {
        this.resetRecaptcha();
        this.isCaptcha = false;
        this.captchaToken = '';
      },
      resetRecaptcha() {
        this.$refs.recaptcha.reset();
        this.isCaptcha = false;
        this.captchaToken = '';
      },
      async fetchVideos() {
        try {
          let response = await axios.get(`${API_STRING}/api/song/list`);
          this.songs = response.data;
          this.show_song_list = true;
        } catch(err) {
          console.log(err);
        }
      },
      async addSongToList(e) {
        e.preventDefault();
        this.show_song_add = false;

        if(!localStorage.getItem('jwt')) {
          this.show_song_add = true;
          Swal.fire({
            icon: 'error',
            title: 'Problem z kontem!',
            text: 'Proszę się wylogować i zalogować ponownie!',
          });
          return;
        }

        const yt_regex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/;
        if(!yt_regex.test(this.yt_link)) {
          this.show_song_add = true;
          Swal.fire({
            icon: 'error',
            title: 'Problem!',
            text: 'Podaj prawidłowy link do filmu!',
          });
          return;
        }

        if(this.yt_link.trim() === "") {
          this.show_song_add = true;
          Swal.fire({
            icon: 'error',
            title: 'Problem!',
            text: 'Pole linku nie może być puste!',
          });
          return;
        } 

        if(!this.isCaptcha) {
          this.show_song_add = true;
          Swal.fire({
            icon: 'error',
            title: 'Problem!',
            text: 'Proszę zaakceptować captche!',
          });
          return;
        }
      
        try {
          const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
          };
          await axios.post(`${API_STRING}/api/song/add`, {
            link: this.yt_link,
            author_id: this.user.id,
            captchaToken: this.captchaToken
          }, config);
          this.fetchVideos();
          this.show_song_add = true;
          Swal.fire({
            icon: 'success',
            title: 'Udało się!',
            text: 'Twoja piosenka powinna być teraz na końcu listy!'
          })
          this.yt_link = "";
        } catch(err) {
          this.show_song_add = true;
          this.yt_link = "";
          this.isCaptcha = false;
          this.captchaToken = '';
          switch (err.response.status) {
            case 400:
              Swal.fire({
                icon: 'error',
                title: 'Błąd!',
                text: 'Proszę podać poprawny link!',
              });
              break;
            case 401:
              Swal.fire({
                icon: 'error',
                title: 'Błąd!',
                text: 'Proszę zaakceptować captche!',
              });
              break;
            case 405:
              Swal.fire({
                icon: 'error',
                title: 'Błąd!',
                text: 'Aby dodać do listy piosenkę, musisz mieć zweryfikowane konto!',
              });
              break;
            case 500:
              Swal.fire({
                icon: 'error',
                title: 'Błąd!',
                text: 'Nie udało się dodać piosenki do listy!',
              });
              break;
            case 501:
              Swal.fire({
                icon: 'error',
                title: 'Błąd!',
                text: 'Błąd captchy! Skontaktuj się z admistratorem, jeżeli pojawia się to dość często!',
              });
              break;
            default:
              Swal.fire({
                icon: 'error',
                title: 'Błąd!',
                text: 'Nie udalo się dodać piosenki! Zgłoś problem do administratora!',
              });
              console.log(`Błąd: ${err}`);
              break;
                    }
        }
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

.g-recaptcha {
  display: inline-block;
}

@media screen and (min-width: 1000px) {
  .card {
    max-width: 30vw;
  }
}
</style>