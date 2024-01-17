<template>
    <div class="container mt-4">
        <div class="row justify-content-center">
            <div class="col-lg-8 col-md-12">
                <div class="mb-3" v-for="recipe in shown_recieps" :key="recipe._id">
                    <div class="recipesBox" @click="goToRecipe(recipe._id)">
                        <div class="photoBox"><img src="../front-end-images/food.jpg" alt="food"></div>
                        <div class="titleBox"><h5> {{ recipe.name }}</h5></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row justify-content-center mb-5" v-show="props.recipes.length > 10">
            <div class="col">
                <button class="btn me-3" @click="goPreviousPage" :disabled="currentPage === 1">Previous page</button>
                <button class="btn" @click="goNextPage" :disabled="lastIndex >= props.recipes.length">Next page</button>
            </div>
        </div>
    </div>
</template>

<script setup> 
import { computed, defineProps, ref } from 'vue'
import router from '../router';

let props = defineProps(['recipes'])
//TODO: Paginatioin to be added.
const recipes_per_page = 10;
let currentPage = ref(1);

let startIndex = computed(() => { return ((currentPage.value - 1) * recipes_per_page)})
let lastIndex = computed(() => { return (startIndex.value + recipes_per_page)})

let shown_recieps = computed(() => {
    return props.recipes.slice(startIndex.value, lastIndex.value)
})

function goNextPage() {
    currentPage.value++
}

function goPreviousPage(){
    if(currentPage.value > 1){
        currentPage.value--
    }
}

async function goToRecipe (recipeId) {
    router.push(`/recipes/${recipeId}`)
}


</script>

<style scoped>

button {
  background-color: #ff6f3c;
  color: #f1f1f1;
}

button:hover {
  background-color: #f1f1f1;
  color: #ff6f3c;
  border: 1px solid #ff6f3c;
}

.recipesBox {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: start;
    border-bottom: 1px solid #d1d1d1;
    border-top: 1px solid #d1d1d1;
    border-right: 1px solid #d1d1d1;
    border-radius: 5px;
    box-shadow: 0 0 3px rgba(255, 111, 60, 1);
    transition: background-color 0.3s ease, border-top 0.3s ease; /* Add a transition for border-top */
    position: relative; /* Required for pseudo-element */
}

.recipesBox:hover {
    background-color: #f1f1f1;
    color: #155263;
    border-top: 1px solid #ff6f3c; 
}

.recipesBox::before {
    content: "";
    position: absolute;
    top: -1px; 
    left: 0;
    width: 100%;
    height: 2px; 
    background-color: #ff6f3c; 
    transform: scaleX(0); 
    transform-origin: right; 
    transition: transform 0.3s ease; 
}

.recipesBox:hover::before {
    transform: scaleX(1); /* Expand the overline on hover */
    transform-origin: left; /* Animation origin from the left */
}

.photoBox img {
    width: 70px;
    height: 70px;
    border-left: 1px solid;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
}

.titleBox {
    display: flex;
    align-items: center;
    margin-left: 8px;
    font-family: 'Dancing Script', cursive;
}

</style>