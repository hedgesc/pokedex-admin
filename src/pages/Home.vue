<template>
  <Layout>
    <template v-slot:header>
      <router-link class="nav-item nav-link active" to="/">Home</router-link>
      <router-link class="nav-item nav-link" to="/games">Games</router-link>
      <router-link class="nav-item nav-link" to="/characters">Characters</router-link>
      <router-link class="nav-item nav-link" to="/moves">Moves</router-link>
    </template>

    <h1>Home</h1>
  </Layout>
</template>

<script>
import Layout from '@/layouts/Layout';

export default {
  name: 'Home',
  components: {
    Layout
  }
};
</script>