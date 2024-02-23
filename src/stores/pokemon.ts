import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const usePokemonStore = defineStore('pokemon', () => {
  const allPokemon = ref()
  const currentPokemon = ref()

  function searchPokemon(pokemonName: string) {
    axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`).then((response) => {
      currentPokemon.value = response.data
    })
  }

  const sortedPokemon = computed(() => {
    console.log(allPokemon)
    return [...allPokemon.value].sort((a, b) => {
      return a.name.localeCompare(b.name)
    })
  })
  axios.get('https://pokeapi.co/api/v2/pokemon/?limit=1025').then((response) => {
    allPokemon.value = response.data.results
  })

  return { allPokemon, sortedPokemon, currentPokemon, searchPokemon }
})
