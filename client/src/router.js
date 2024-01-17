import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import SignAndLogIn from './views/SignAndLogIn.vue'
import FavoriteRecipes from './views/FavoriteRecipes.vue'
import NewRecipe from './views/NewRecipe.vue'
import Recipe from './views/Recipe.vue'
import ChangeInfo from './views/ChangeInfo.vue'
import invalidrouter from './views/invalidrouter.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/Login',
    name: 'Login',
    component: SignAndLogIn
  },
  {
    path: '/users/:id/favorite_recipes',
    name: 'FavoriteRecipes',
    component: FavoriteRecipes
  },
  {
    path: '/new_recipe',
    name: 'NewRecipe',
    component: NewRecipe
  },
  {
    path: '/recipes/:id',
    name: 'Recipe',
    component: Recipe
  },
  {
    path: '/change-info',
    name: 'ChangeInfo',
    component: ChangeInfo
  },
  {
    path: '/:catchAll(.*)',
    name: 'invalidrouter',
    component: invalidrouter,
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
