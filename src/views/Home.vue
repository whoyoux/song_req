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
        class="mt-4"
      >
          <b-form-input id="input-1" 
            v-model="yt_link" 
            class="w-50 mx-auto" 
            trim
            placeholder="Link do piosenki"
          >
        
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
        <SongCard v-for="song in songs" v-bind:key="song._id" :song="song" :isAdminPanel="false"/>
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
import SongCard from '@/components/SongCard.vue';
export default {
    name: 'Home',
    computed: {
    ...mapState(["isLogged", "user"]),
      isUserAdmin() {
        if(this.user.role == 'Admin') return true;
        else return false;
      },
    },
    components: {
      VueRecaptcha,
      SongCard
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
          let response = await axios.get(`${API_STRING}/api/song/confirmed_list`);
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
            text: 'Twoja piosenka jest na liście do zatwierdzenia!'
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