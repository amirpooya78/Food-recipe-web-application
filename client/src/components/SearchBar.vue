<template>
    <div class="container">
      <div class="row align-items-center justify-content-center my-3">
        <div class="col-lg-8 col-md-12"> 
          <div class="d-flex">
            <input class="form-control me-2" type="text" placeholder="Search" aria-label="Search">
            <button class="btn searchButton" @click="$emit('find-recipes', checkedIngredients)"><i class="bi bi-search"></i></button>
          </div>
        </div>
      </div>
    <div class="row justify-content-center">
      <div class="col-lg-8 col-md-12">
        <button type="button" class="btn w-100 mb-2" data-bs-toggle="collapse" data-bs-target="#ingredientList" aria-expanded="false">Ingredients</button> 
        <div class="collapse mx-auto w-100 row border rounded justify-content-start" id="ingredientList">             
          <div v-for="ingredient in ingredients" :key="ingredient._id" class="col-lg-3 col-md-4 col-6 text-white g-0">
            <div class="d-flex align-items-center"> <!-- Wrap checkbox and label in a flex container -->
              <input type="checkbox" :id="ingredient.name" class="ms-2 checkbox" :value="ingredient.name" v-model="checkedIngredients">
              <label :for="ingredient.name" class="ms-1"> {{ ingredient.name }} </label> <!-- Add margin to label -->
            </div>
          </div>
        </div>    
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref } from 'vue'

defineProps(['ingredients'])
defineEmits(['find-recipes'])

const checkedIngredients = ref([])
let keyword = ref('')

</script>

<style scoped>

.searchButton {
  transition: 0.3s;
}
.searchButton:hover {
  transform: rotate(6deg);
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


#ingredientList {
  max-height: 350px;
  overflow-y: auto;
  background-color: #ff6f3c;
}


#ingredientList::-webkit-scrollbar {
  width: 12px;
}

#ingredientList::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

#ingredientList::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #28282B;
}

input[type="text"]:focus {
  border: 1px solid #d1d1d1;
  box-shadow: 0 0 12px rgba(255, 111, 60, 0.9);
}

/* Custom check boxes*/

/* Removing the default checkbox*/
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
