<template>
    <Header></Header>
    <RecipeCard :recipe="recipe" :is-favorite="isFavorite" :is-logged-in="isLoggedIn" class="mt-3" @add-favorite="addFavorite()" @remove-favorite="removeFavorite()"></RecipeCard>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Header from '../components/Header.vue'
import RecipeCard from '../components/RecipeCard.vue'
import { Api } from '../Api';

let recipe = ref({})

const route = useRoute()
let isFavorite = ref(false)
let isLoggedIn = ref(false)

onMounted(async () => {
    const recipeId = route.params.id
    
    Api.get(`v1/recipes/${recipeId}`)
    .then((response) => {
        if(response.status === 200) {
            recipe.value = response.data
        }
    })
    .catch((error) => {
        console.error(error)
    })

    let token = localStorage.getItem('x-access-token')

    if(token) {
        Api.get('/v1/users/:id/favorite_recipes', {
            headers: {
                'x-access-token': token
            }
        })
        .then((response) => {
            if(response.status === 200) {
                isLoggedIn.value = true
            
                response.data.forEach((recipe) => {
                    if(recipe._id === recipeId) {
                        isFavorite.value = true
                    } 
                })
            }
        })
        .catch((error) => {
            console.error(error)
        })
    }
})


async function removeFavorite () {
    Api.delete(`/v1/users/:id/favorite_recipes/${route.params.id}`, {
        headers: {
            'x-access-token': localStorage.getItem('x-access-token')
        }
    })
    .then((response) => {
        if(response.status === 200){
            isFavorite.value = false
        }
    })
    .catch((error) => {
        if(error.response.status === 404){
            console.log("Recipe or user with given id was not found in user's favorite list")
        }
    })
}

async function addFavorite () {
    Api.post('/v1/users/:id/favorite_recipes', {recipe: route.params.id}, {
        headers: {
            'x-access-token': localStorage.getItem('x-access-token')
        }
    })
    .then((response) => {
        if(response.status === 201) {
            isFavorite.value = true
        }
    })
    .catch((error) => {
        if(error.response.status === 404){
            console.log(error.response)
        }
        else if(error.response.status === 409) {
            console.log('This recipe is already in favorite list')
        }
        else {
            console.error(error);
        }
    })
}

</script>

<style >
</style>