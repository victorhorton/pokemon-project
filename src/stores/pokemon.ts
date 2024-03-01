import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import {
  type PokemonTypeStat,
  type SimplePokemon,
  type SimplePokemonTypes
} from '@/types/dataTypes'
import type { Pokemon } from 'pokenode-ts'

export const usePokemonStore = defineStore('pokemon', () => {
  const allPokemon = ref(new Array<SimplePokemon>())
  const allPokemonTypes = ref(new Array<SimplePokemonTypes>())
  const currentPokemon: Ref<Pokemon | undefined> = ref()
  const currentPokemonDamageRelation = ref({
    doubleDamageFrom: new Array<string>(),
    doubleDamageTo: new Array<string>(),
    halfDamageFrom: new Array<string>(),
    halfDamageTo: new Array<string>(),
    noDamageFrom: new Array<string>(),
    noDamageTo: new Array<string>()
  })

  function searchPokemon(pokemonName: string): void {
    $reset()
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
      .then((response) => {
        currentPokemon.value = response.data
      })
      .finally(() => {
        if (currentPokemon.value) {
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
        }
      })
  }

  function progressBarStyle(stat: number): string {
    const maxStat = Math.max(
      ...currentTypesStats.value.map((currentTypeStat) => currentTypeStat.stat)
    )
    const minStat = Math.min(
      ...currentTypesStats.value.map((currentTypeStat) => currentTypeStat.stat)
    )
    const statAsPercent = (stat / (maxStat - minStat)) * 100
    const margin = statAsPercent < 0 ? 50 - Math.abs(statAsPercent) : 50
    const dangerColor = statAsPercent < 0 ? ' background-color: #dc3545;' : ''

    return `width: ${Math.abs(statAsPercent)}%; margin-left: ${margin}%;${dangerColor}`
  }

  function $reset() {
    currentPokemon.value = undefined
    currentPokemonDamageRelation.value.doubleDamageFrom = []
    currentPokemonDamageRelation.value.doubleDamageTo = []
    currentPokemonDamageRelation.value.halfDamageFrom = []
    currentPokemonDamageRelation.value.halfDamageTo = []
    currentPokemonDamageRelation.value.noDamageFrom = []
    currentPokemonDamageRelation.value.noDamageTo = []
  }

  const sortedPokemon: ComputedRef<SimplePokemon[]> = computed(() => {
    return [...allPokemon.value].sort((a, b) => {
      return a.name.localeCompare(b.name)
    })
  })

  const currentTypesStats: ComputedRef<PokemonTypeStat[]> = computed(() => {
    return allPokemonTypes.value
      .map((pokemonType: { name: string }) => {
        let stat = 0

        currentPokemonDamageRelation.value.doubleDamageFrom.forEach((damageRelation) => {
          if (damageRelation === pokemonType.name) {
            stat -= 2
          }
        })
        currentPokemonDamageRelation.value.doubleDamageTo.forEach((damageRelation) => {
          if (damageRelation === pokemonType.name) {
            stat += 2
          }
        })
        currentPokemonDamageRelation.value.halfDamageFrom.forEach((damageRelation) => {
          if (damageRelation === pokemonType.name) {
            stat += 1.5
          }
        })
        currentPokemonDamageRelation.value.halfDamageTo.forEach((damageRelation) => {
          if (damageRelation === pokemonType.name) {
            stat -= 1.5
          }
        })
        currentPokemonDamageRelation.value.noDamageFrom.forEach((damageRelation) => {
          if (damageRelation === pokemonType.name) {
            stat += 3
          }
        })
        currentPokemonDamageRelation.value.noDamageTo.forEach((damageRelation) => {
          if (damageRelation === pokemonType.name) {
            stat -= 3
          }
        })

        return {
          name: pokemonType.name,
          stat
        }
      })
      .sort((a, b) => b.stat - a.stat)
  })

  axios.get('https://pokeapi.co/api/v2/pokemon/?limit=1025').then((response) => {
    allPokemon.value = response.data.results
  })

  axios.get('https://pokeapi.co/api/v2/type/').then((response) => {
    allPokemonTypes.value = response.data.results
  })

  return {
    allPokemon,
    sortedPokemon,
    currentPokemon,
    currentPokemonDamageRelation,
    currentTypesStats,
    progressBarStyle,
    searchPokemon
  }
})
