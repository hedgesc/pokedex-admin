<template>
  <div id="app">
    <nav id="nav" class="navbar navbar-dark bg-dark navbar-expand-md">
      <a target="_self" href="#" class="navbar-brand">
        <img src="@/assets/logo.png" width="32" height="32" />
      </a>
      <button
        type="button"
        aria-label="Toggle navigation"
        aria-controls="nav-collapse"
        aria-expanded="false"
        class="navbar-toggler"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div
        id="nav-collapse"
        class="navbar-collapse collapse"
        style="display: none;"
      >
        <ul class="navbar-nav">
          <li
            :class="[
              currentPage.includes('home') ? activeClass : '',
              'nav-item'
            ]"
          >
            <router-link class="nav-link" to="/home">
              Home
            </router-link>
          </li>
          <li
            :class="[
              currentPage.includes('pokedex') ? activeClass : '',
              'nav-item'
            ]"
          >
            <router-link class="nav-link" to="/pokedex/list">
              Pokédexes
            </router-link>
          </li>
          <li
            :class="[
              currentPage.includes('game') ? activeClass : '',
              'nav-item'
            ]"
          >
            <router-link class="nav-link" to="/game/list">
              Games
            </router-link>
          </li>
          <li
            :class="[
              currentPage.includes('character') ? activeClass : '',
              'nav-item'
            ]"
          >
            <router-link class="nav-link" to="/characters">
              Characters
            </router-link>
          </li>
          <li
            :class="[
              currentPage.includes('move') ? activeClass : '',
              'nav-item'
            ]"
          >
            <router-link class="nav-link" to="/moves">
              Moves
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
    <div class="container-fluid">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeClass: "active"
    };
  },
  computed: {
    currentPage() {
      console.log("route path", this.$route.path);
      return this.$route.path;
    }
  }
};
</script>
