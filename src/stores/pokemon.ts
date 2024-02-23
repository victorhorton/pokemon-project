import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const usePokemonStore = defineStore('pokemon', () => {
  const allPokemon = ref()
  const currentPokemon = ref()
  const currentPokemonDamageRelation = ref({
    doubleDamageFrom: new Array<string>(),
    doubleDamageTo: new Array<string>(),
    halfDamageFrom: new Array<string>(),
    halfDamageTo: new Array<string>(),
    noDamageFrom: new Array<string>(),
    noDamageTo: new Array<string>()
  })

  function searchPokemon(pokemonName: string) {
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
      .then((response) => {
        currentPokemon.value = response.data
      })
      .finally(() => {
        currentPokemon.value.types.forEach((pokemonType: { type: { url: string } }) => {
          axios.get(pokemonType.type.url).then((response) => {
            const doubleDamageFromTypes = response.data.damage_relations.double_damage_from.map(
              (pokemoneType: { name: string }) => {
                return pokemoneType.name
              }
            )
            const doubleDamageToTypes = response.data.damage_relations.double_damage_to.map(
              (pokemoneType: { name: string }) => {
                return pokemoneType.name
              }
            )
            const halfDamageFromTypes = response.data.damage_relations.half_damage_from.map(
              (pokemoneType: { name: string }) => {
                return pokemoneType.name
              }
            )
            const halfDamageToTypes = response.data.damage_relations.half_damage_to.map(
              (pokemoneType: { name: string }) => {
                return pokemoneType.name
              }
            )
            const noDamageFromTypes = response.data.damage_relations.no_damage_from.map(
              (pokemoneType: { name: string }) => {
                return pokemoneType.name
              }
            )
            const noDamageToTypes = response.data.damage_relations.no_damage_to.map(
              (pokemoneType: { name: string }) => {
                return pokemoneType.name
              }
            )

            currentPokemonDamageRelation.value.doubleDamageFrom.push(...doubleDamageFromTypes)
            currentPokemonDamageRelation.value.doubleDamageTo.push(...doubleDamageToTypes)
            currentPokemonDamageRelation.value.halfDamageFrom.push(...halfDamageFromTypes)
            currentPokemonDamageRelation.value.halfDamageTo.push(...halfDamageToTypes)
            currentPokemonDamageRelation.value.noDamageFrom.push(...noDamageFromTypes)
            currentPokemonDamageRelation.value.noDamageTo.push(...noDamageToTypes)
          })
        })
      })
  }

  const sortedPokemon = computed(() => {
    return [...allPokemon.value].sort((a, b) => {
      return a.name.localeCompare(b.name)
    })
  })

  axios.get('https://pokeapi.co/api/v2/pokemon/?limit=1025').then((response) => {
    allPokemon.value = response.data.results
  })

  return {
    allPokemon,
    sortedPokemon,
    currentPokemon,
    currentPokemonDamageRelation,
    searchPokemon
  }
})
