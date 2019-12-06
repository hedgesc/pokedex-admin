<template>
  <Layout>
    <template v-slot:header>
      <router-link class="nav-item nav-link" to="/">Home</router-link>
      <router-link class="nav-item nav-link" to="/games">Games</router-link>
      <router-link class="nav-item nav-link active" to="/characters">Characters</router-link>
      <router-link class="nav-item nav-link" to="/moves">Moves</router-link>
    </template>

    <main role="main">
        <div class="border-bottom bg-light py-2 px-3 mx-n3">
            <b-form-select 
                v-model="filters.generation.selected" 
                v-on:change="refreshCharacters"
                :options="filters.generation.options" style="width: auto">
            </b-form-select>
        </div>
        <h1>Generation {{ filters.generation.selected }} Pokemon</h1>
        <div v-for="(c, i) in characters" v-bind:key="i">
            {{ c.name }}
        </div>
    </main>
  </Layout>
</template>

<script>
import Layout from '@/layouts/Layout';

export default {
    name: 'Characters',
    components: {
        Layout
    },
    data () {
        return {
            filters: { 
                generation: {
                    selected: 1,
                    options: [
                        { value: 1, text: 'Generation 1' },
                        { value: 2, text: 'Generation 2' },
                        { value: 3, text: 'Generation 3' },
                        { value: 4, text: 'Generation 4' },
                        { value: 5, text: 'Generation 5' },
                        { value: 6, text: 'Generation 6' },
                        { value: 7, text: 'Generation 7' },
                    ]
                }  
            },
            characters: []
        }
    },
    created () {
        this.fetchCharacters()
    },
    methods: {
        fetchCharacters () {
            return fetch(
                    "http://3083ae13.ngrok.io/api/characters?generation=" + this.filters.generation.selected
                )
                .then(res => res.json())
                .then(res => (this.characters = res.data));
        },
        refreshCharacters (e) {
            
        }
    }
};
</script>

<style lang="scss">
    
</style>