<template>
  <div>
    <Header></Header>
    <SearchBar :ingredients="ingredients" @find-recipes="findRecipes"/>
    <HomeRecipes v-if="showRecipes" :recipes="filteredRecipes"/>
    <div v-else class="container-fluid mt-3">
      <div class="row justify-content-center">
        <div class="col d-flex justify-content-center">
          <div class="warning"><h5>No Recipes was found based on your ingredients</h5></div>
        </div>
      </div>
    </div>
  </div> 
</template>

<script setup>
// @ is an alias to /src
import { ref, onMounted } from 'vue' // Import ref from Vue 3
import { Api } from '@/Api'
import Header from '../components/Header.vue'
import SearchBar from '../components/SearchBar.vue'
import HomeRecipes from '../components/HomeRecipes.vue'



let ingredients = ref([])
let recipes = ref([])
let showRecipes = ref(true)

let filteredRecipes = ref([]);

onMounted(async () => {
  try {
    const ingredientResponse  = await Api.get('/v1/ingredients')
  ingredients.value = ingredientResponse.data

  const recipeResponse = await Api.get('/v1/recipes')
  recipes.value = recipeResponse.data
    
  } catch (error) {
      console.log(error);
      alert("server is unreachable");
  }
  
}); 

async function findRecipes(ingredients) {

  let foundRecipes = recipes.value.filter((recipe) => {

    let count = 0
    //console.log('hello')
    for(let i = 0 ; i < recipe.list_of_ingredients.length ; i++){

      let currentRecipeIngredient = recipe.list_of_ingredients[i]

      for(let j = 0 ; j < ingredients.length ; j++){

        let currentUserIngredient = ingredients[j]

        if(currentRecipeIngredient.ingredient.name === currentUserIngredient){
          count++;
          break;
        }
      }
    }
    return count === recipe.list_of_ingredients.length
  })

  filteredRecipes.value = foundRecipes;
  filteredRecipes.value.length > 0 ? showRecipes.value = true: showRecipes.value = false; 
}

</script>

<style>

.warning {
  background-color: #f1f1f1;
  color: #ff3232;
  padding: 6px 10px 6px 10px;
  border-radius: 10px;
  border: 2px solid #28282B;
}

</style>
