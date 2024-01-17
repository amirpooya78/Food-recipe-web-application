<template>
    <div class="container">
        <div class="row justify-content-center my-3">
            <div class="col-12"> <h1>New Recipe</h1> </div>
        </div>
        <div class="row justify-content-center mx-1">
            <div class="col-lg-6 col-md-10 col-sm-12 mx-5 my-form">
                <div class="input-containers">
                    <label for="recipeName" class="form-label">Name:</label>
                    <input class="input-styling" type="text" name="recipeName" id="recipeName" v-model="recipeName">
                </div>
                <div class="input-containers">
                    <label for="nutritionInfo">Nutrition information:</label>
                    <input class="input-styling" type="text" name="nutritionInfo" id="nutritionInfo" v-model="recipeNutrition">
                </div>
                <div>
                    <button type="button" class="btn w-100 mb-2" data-bs-toggle="collapse" data-bs-target="#ingredientList" aria-expanded="false">Ingredients</button> 
                    <div class="collapse mx-auto w-100 row border rounded justify-content-start" id="ingredientList">             
                        <div v-for="ingredient in ingredients" :key="ingredient._id" class="col-lg-4 col-md-4 col-6 text-white g-0">
                            <div class="d-flex align-items-center"> <!-- Wrap checkbox and label in a flex container -->
                                <input type="checkbox" :id="ingredient.name" class="ms-2 checkbox" :value="ingredient" v-model="checkedIngredients">
                                <label :for="ingredient.name" class="ms-1"> {{ ingredient.name }} </label> <!-- Add margin to label -->
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div v-for="ingredient in checkedIngredients" class="input-group mt-2">
                        <span class="input-group-text w-25 span-styling" >{{ ingredient.name }}</span>
                        <input type="text" class="form-control input-styling" v-model="ingredient.quantity" placeholder="Quantity" aria-label="Quantity" aria-describedby="basic-addon1">
                        <span class="input-group-text w-25 span-styling" >{{ ingredient.unit_of_measurement }}</span>
                    </div>
                </div>
                <div class="input-containers mt-2">
                    <label for="info">Description</label>
                    <textarea class="input-styling" id="info" v-model="recipeInfo"></textarea>
                </div>
                <div>
                    <button class="btn w-100" @click="submitRecipe()"> submit </button>
                </div>
            </div>
            <div class="container mt-3">
                <div class="row justify-content-center">
                    <div v-if="showWarning" class="col-12 d-flex justify-content-center">
                        <div class="warning"><i class="bi bi-dash-circle"></i><span class="ms-2">{{ warningMessage }}</span></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, defineProps, ref } from 'vue'
import { Api } from '../Api';
import router from '../router';

let props = defineProps(['ingredients'])

let checkedIngredients = ref([]);

let ingredientWithQuantity = computed(() => {
    return checkedIngredients.value.map((ingredient) => {
        return {ingredient: ingredient.name, quantity: parseInt(ingredient.quantity)}
    })
})

let recipeName = ref('')
let recipeInfo = ref('')
let recipeNutrition = ref('')

let showWarning = ref(false)
let warningMessage = ref('')

function createNewRecipeObject() {
  return {
    name: recipeName.value,
    nutrition_information: recipeNutrition.value,
    information: recipeInfo.value,
    list_of_ingredients: ingredientWithQuantity.value,
  };
}

async function submitRecipe() {

    let newRecipe = createNewRecipeObject()

    if(newRecipe.list_of_ingredients.length < 1) {
        showWarning.value = true
        return warningMessage.value = 'Choose at least one ingredient.'
    }

    if(newRecipe.name.length < 1 || newRecipe.information.length < 1 || newRecipe.nutrition_information.length < 1) {
        showWarning.value = true
        return warningMessage.value = 'Fill in all the fields'
    }

    let hasInvalidQuantity = newRecipe.list_of_ingredients.some((ingredient) => {
        return isNaN(ingredient.quantity);
    });

    if (hasInvalidQuantity) {
        showWarning.value = true
        return warningMessage.value = 'Fill in all the quantities'
    }

    Api.post('/v1/authors/:userId/published_recipes', newRecipe, {
        headers: {
            'x-access-token': localStorage.getItem('x-access-token')
        }
    })
    .then((response) => {
        if(response.status === 201) {
            router.push({name: 'Home'})
        }
    })
    .catch((error) => {
        if(error.response.status === 403) {
            localStorage.removeItem('x-access-token')
            router.push('Home')
        }
        console.error(error)
    })
}

</script>

<style scoped>
.warning {
  background-color: #f1f1f1;
  color: #ff3232;
  padding: 6px 10px 6px 10px;
  border-radius: 10px;
  border: 2px solid #28282B;
}

.span-styling {
    background-color: #ff6f3c;
    color: #f1f1f1;
}

button {
  background-color: #ff6f3c;
  color: #f1f1f1;
}

button:hover {
  background-color: #f1f1f1;
  color: #ff6f3c;
  border: 1px solid #ff6f3c;
}

.input-containers {
    display: flex;
    flex-direction: column;
    margin-bottom: 5px;
}

label {
    text-align: left;
}

input, textarea{
    
    width: 100%;
}

textarea {
    min-height: 100px;
}

.input-styling {
    border: 1px solid #d1d1d1;
    border-radius: 5px;
    outline: none;
}

.input-styling:focus {
    box-shadow: 0 0 12px rgba(255, 111, 60, 0.9);
}

.my-form {
    max-width: 750px;
    border: 2px solid #ff6f3c;
    border-radius: 10px;
    padding: 10px;
}

#ingredientList {
  max-height: 350px;
  overflow-y: auto;
  background-color: #ff6f3c;
}


#ingredientList::-webkit-scrollbar {
  width: 10px;
}

#ingredientList::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

#ingredientList::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #28282B;
}

input[type="checkbox"] {
  /* Add if not using autoprefixer */
  -webkit-appearance: none;
  appearance: none;
  /* For iOS < 15 to remove gradient background */
  background-color: #fff;
  /* Not removed via appearance */
  margin: 0;
}

input[type="checkbox"] {
  appearance: none;
  background-color: #fff;
  margin: 0;
  font: inherit;
  color: #f1f1f1;
  width: 1em;
  height: 1em;
  border: 0.1em solid #f1f1f1;
  border-radius: 0.1em;
  transform: translateY(-0.075em);
}

input[type="checkbox"] {
  /* ...existing styles */
  display: grid;
  place-content: center;
}

input[type="checkbox"]::before {
  content: "";
  width: 0.65em;
  height: 0.65em;
  transform: scale(0);
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em #ff6f3c;
}

input[type="checkbox"]:checked::before {
  transform: scale(1);
}

input[type="checkbox"]::before {
  /* ...existing styles */

  transform-origin: bottom left;
  clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
}
   
</style>