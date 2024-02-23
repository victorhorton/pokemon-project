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
    <div class="row">
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
      <div class="col">
        <img :src="pokemonStore.currentPokemon.sprites.front_default" />
      </div>
      <div class="col">
        <h1>
          {{ pokemonStore.currentPokemon.name }}
        </h1>
      </div>
    </div>
    <div class="row">{{ pokemonStore.currentPokemonDamageRelation.doubleDamageFrom }}</div>
    <div class="row">{{ pokemonStore.currentPokemonDamageRelation.doubleDamageTo }}</div>
    <div class="row">{{ pokemonStore.currentPokemonDamageRelation.halfDamageFrom }}</div>
    <div class="row">{{ pokemonStore.currentPokemonDamageRelation.halfDamageTo }}</div>
    <div class="row">{{ pokemonStore.currentPokemonDamageRelation.noDamageFrom }}</div>
    <div class="row">{{ pokemonStore.currentPokemonDamageRelation.noDamageTo }}</div>
  </div>
  <datalist id="pokemon-datalist">
    <option
      v-for="(pokemon, idx) in pokemonStore.allPokemon"
      :key="idx"
      :value="pokemon.name"
    ></option>
  </datalist>
</template>
