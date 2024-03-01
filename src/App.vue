<script setup lang="ts">
import { ref } from 'vue'
import { usePokemonStore } from './stores/pokemon'
const pokemonSearch = ref('')
const pokemonStore = usePokemonStore()

function searchPokemon() {
  pokemonStore.searchPokemon(pokemonSearch.value)
  pokemonSearch.value = ''
}
</script>

<template>
  <div class="container">
    <div class="row my-3">
      <div class="col">
        <form @submit.prevent="searchPokemon()">
          <div class="input-group my-3">
            <div class="form-floating">
              <input
                type="text"
                id="pokemon-search"
                class="form-control"
                list="pokemon-datalist"
                placeholder="Pokemon"
                v-model="pokemonSearch"
              />
              <label for="pokemon-search">Search Pokemon</label>
            </div>
            <button class="btn btn-primary">Search</button>
          </div>
        </form>
      </div>
    </div>
    <div v-if="pokemonStore.currentPokemon" class="row align-items-center">
      <div class="col-3 col-md-2">
        <img :src="pokemonStore.currentPokemon.sprites.front_default" />
      </div>
      <div class="col">
        <h1 class="text-capitalize text-center">
          {{ pokemonStore.currentPokemon.name }}
        </h1>
      </div>
    </div>
    <div class="row my-3">
      <div class="col">
        <div class="row" v-for="typeStat in pokemonStore.currentTypesStats" :key="typeStat.name">
          <div class="col-3 col-md-2 text-capitalize">{{ typeStat.name }}</div>
          <div class="col">
            <div
              class="progress"
              role="progressbar"
              aria-label="Basic example"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div class="progress-bar" :style="pokemonStore.progressBarStyle(typeStat.stat)"></div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col offset-3 offset-md-2 text-end">Weaker Against</div>
          <div class="col">Stronger Against</div>
        </div>
      </div>
    </div>
  </div>
  <datalist id="pokemon-datalist">
    <option
      v-for="(pokemon, idx) in pokemonStore.allPokemon"
      :key="idx"
      :value="pokemon.name"
    ></option>
  </datalist>
</template>
