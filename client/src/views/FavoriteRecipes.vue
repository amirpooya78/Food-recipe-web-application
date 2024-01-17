<template>
    <Header></Header>
    <HomeRecipes :recipes="user_favorite_recipes"></HomeRecipes>
    <div v-if="user_favorite_recipes.length != 0" class="container">
        <div class="row">
            <div class="col-12">
                <button class="button-styling" @click="removeAllRecipes">Remove all recipes</button>
            </div>
        </div>
    </div>
    <div v-else>
        <div class="row">
            <div class="col-12">
                <h1>You don't have any favorite recipe at moment in your list</h1> 
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Header from '../components/Header.vue'
import HomeRecipes from '../components/HomeRecipes.vue'
import router from '../router';
import { Api } from '../Api';

let user_favorite_recipes = ref([])

async function removeAllRecipes () {
    
    let token = localStorage.getItem('x-access-token')
    if(!token) {
        router.push({name: 'Home'})
    }
    
    Api.delete('/v1/users/:id/favorite_recipes',{
        headers: {
            'x-access-token': token
        }
    })
    .then((response) => {
        if(response.status === 200) {
            user_favorite_recipes.value = []
            alert('All recipes were removed successfully')
        }
    })
    .catch((error) => {
        if(error.response.status === 403){
            localStorage.removeItem('x-access-token')
            router.push({name: 'Home'})
        }
    })
}

onMounted(() => {
    let token = localStorage.getItem('x-access-token')
    if(!token) {
        router.push({name: 'Home'});
    } 
    else {
        Api.get('/v1/users/:id/favorite_recipes', {
            headers: {
                'x-access-token': token
            }
        })
        .then((response) => {
            if (response.status === 200) {
                user_favorite_recipes.value = response.data
            }
        })
        .catch((error) => {
            if (error.response.status === 403 || error.response.status === 404) {
                localStorage.removeItem('x-access-token')
                router.push({name: 'Home'})
            }
        })
    }
})

</script>

<style scoped>

/* CSS */
.button-styling {
  align-items: center;
  background-clip: padding-box;
  background-color: #ff6f3c;
  border: 1px solid transparent;
  border-radius: .25rem;
  box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  font-family: system-ui,-apple-system,system-ui,"Helvetica Neue",Helvetica,Arial,sans-serif;
  font-size: 16px;
  font-weight: 600;
  justify-content: center;
  line-height: 1.25;
  margin: 0;
  min-height: 3rem;
  padding: calc(.875rem - 1px) calc(1.5rem - 1px);
  position: relative;
  text-decoration: none;
  transition: all 250ms;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: baseline;
  width: auto;
}

.button-styling:hover,
.button-styling:focus {
  background-color: #fb8332;
  box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
}

.button-styling:hover {
  transform: translateY(-1px);
}

.button-styling:active {
  background-color: #c85000;
  box-shadow: rgba(0, 0, 0, .06) 0 2px 4px;
  transform: translateY(0);
}

</style>