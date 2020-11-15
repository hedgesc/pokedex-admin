<template>
  <div class="home">
    <h1>Pokèdex Admin</h1>
    <b-row>
      <b-col sm="4">
        <b-list-group>
          <b-list-group-item to="/pokedex/list">Pokèdexes</b-list-group-item>
          <b-list-group-item to="/game/list">Games</b-list-group-item>
          <b-list-group-item to="/character/list">Characters</b-list-group-item>
          <b-list-group-item to="/move/list">Moves</b-list-group-item>
        </b-list-group>
      </b-col>
      <b-col sm="8"></b-col>
    </b-row>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  components: {}
}
</script>
