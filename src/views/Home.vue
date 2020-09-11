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

      <h4>piosenka nr1</h4>
      <h4>piosenka nr1</h4>
      <h4>piosenka nr1</h4>
      <h4>piosenka nr1</h4>
      <h4>piosenka nr1</h4>
      <h4>piosenka nr1</h4>
    </b-container>
    
  </div>
</template>

<script>
import {mapState} from 'vuex';
export default {
    name: 'Home',
    computed: {
    ...mapState(["isLogged"]),
    },
    data() {
      return {
        yt_link: ""
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
