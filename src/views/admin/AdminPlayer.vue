<template>
  <div>
      <h1 class="mt-2">Admin Player</h1>
      <b-spinner label="Loading..." class="mt-5" v-if="!show_song_list"></b-spinner>
      <div v-else-if="isEmpty">
          <h3>Lista jest pusta!</h3>
      </div>
      <div v-else-if="!isEmpty">
          <p style="font-size: 1.5rem">Tytuł: <b>{{songs[0].videoTitle}}</b></p>
          <p style="font-size: 1.2rem">Autor: <b>{{songs[0].videoAuthor}}</b></p>
          <p style="font-size: 1.1rem">Zgłoszone przez: <b>{{songs[0].author_nickname}}</b></p>
          <p style="font-size: 1.1rem">Zaakceptowane przez: <b>{{songs[0].accepted_by}}</b></p>
        <iframe 
            width="50%" 
            height="500" 
            :src="`https://www.youtube.com/embed/${actualVideoID}`" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
        >
        </iframe>
        <div v-if="songs[videoCouter+1] != undefined || songs[videoCouter+1] != null">
          <p>Następne: <b>{{songs[videoCouter+1].videoTitle}}</b> by <b>{{songs[videoCouter+1].videoAuthor}}</b></p>
        </div>
        
        <br />
            <b-button @click="setNextVideo" variant="warning">Przejdź do następnej</b-button>
      </div>
  </div>
</template>

<script>
import axios from 'axios';
import {API_STRING} from '../../config';
export default {
    name: 'AdminPlayer',
    data() {
        return {
            songs: [],
            show_song_list: false,
            actualVideoID: "",
            videoCouter: 0,
            isEmpty: false
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
            let response = await axios.get(`${API_STRING}/api/song/confirmed_list`);
            this.songs = response.data;
            this.show_song_list = true;

            this.setActualVideoID();
            } catch(err) {
                this.isEmpty = true;
                console.log(err);
            }
      },
      setNextVideo() {
        if(this.songs[this.videoCouter] === undefined) {
            this.isEmpty = true;
            this.actualVideoID = "";
            this.videoCouter = 0;
            return;
        }

        this.deleteSong(this.songs[this.videoCouter]);
        this.videoCouter++;

        this.setActualVideoID();
      },
      setActualVideoID() {
        if(this.songs[this.videoCouter] === undefined) {
            this.isEmpty = true;
            this.actualVideoID = "";
            this.videoCouter = 0;
            return;
        }
        let video_id = this.songs[this.videoCouter].link.split('v=')[1];
        let ampersandPosition = video_id.indexOf('&');
        if(ampersandPosition != -1) {
            video_id = video_id.substring(0, ampersandPosition);
        }
        this.actualVideoID = video_id;
      },
      async deleteSong(id) {
        try{
          const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
          };
          await axios.post(`${API_STRING}/api/song/delete`, {
            "song_id": id
          },config);
        } catch(err) {
          console.log(err);
        }
      },
    }
}
</script>

<style>

</style>