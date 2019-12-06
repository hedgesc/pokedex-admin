<template>
  <Layout>
    <template v-slot:header>
      <router-link class="nav-item nav-link" to="/">Home</router-link>
      <router-link class="nav-item nav-link active" to="/games">Games</router-link>
      <router-link class="nav-item nav-link" to="/characters">Characters</router-link>
      <router-link class="nav-item nav-link" to="/moves">Moves</router-link>
    </template>
    
    <h1>Games</h1>
  </Layout>
</template>

<script>
import Layout from '@/layouts/Layout';

export default {
  name: 'Games',
  components: {
      Layout
  }
};
</script>