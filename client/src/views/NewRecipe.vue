<template>
    <Header></Header>
    <NewRecipe :ingredients="ingredients"></NewRecipe>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Header from '../components/Header.vue'
import NewRecipe from '../components/RecipeForm.vue'
import { Api } from '../Api';

let ingredients = ref([])

onMounted(async () => {
  const ingredientResponse  = await Api.get('/v1/ingredients')
  ingredients.value = ingredientResponse.data
}); 

</script>

<style scoped>

</style>