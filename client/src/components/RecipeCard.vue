<template>
    <div class="container" style="background-color: #f5f5f5;">
        <div class=" row justify-content-center">
            <div class="col-12 col-lg-4 col-md-4 col-sm-4"> <img class="img-fluid rounded" src="../front-end-images/food.jpg" alt="food picture" style="margin-top: 3%;"> </div>
            <div class="col-12 col-lg-8 col-md-8 col-sm-8 mt-2">
                <!--Recipe nutrition information-->
                <div class="row justify-content-start">
                    <div class="col-10">
                        <div class="myContainer" id="nut-info">
                            <h4>Nutrition information</h4>
                            <p> {{ recipe.nutrition_information }} </p>
                        </div>
                    </div>
                    <div class="col-2" v-show="isLoggedIn">
                        <button v-if="!isFavorite" class="button-styling" @click="$emit('add-favorite')"><i class="bi bi-heart"></i></button>
                        <button v-else class="button-styling" @click="$emit('remove-favorite')"><i class="bi bi-heart-fill"></i></button>
                    </div>
                </div>
                <!--Ingredients container-->
                <div class="row">
                    <div class="col-12">
                        <div class="myContainer"> <h4>List of ingredients</h4> </div>
                        <div id="ingredients">
                            <li class="ms-4" v-for="ingredient in recipe.list_of_ingredients"><span>{{ ingredient.ingredient.name }}</span> <span>{{ ingredient.quantity }}</span> <span>{{ ingredient.ingredient.unit_of_measurement }}</span></li>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row justify-content-start mt-3">
            <div class="col-12" id="recipeTitle"> <h1>{{ recipe.name }}</h1> </div>
            <div class="col-12" id="recipeInfo"> <p>{{ recipe.information }}</p> </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

let props = defineProps(['recipe', 'isFavorite', 'isLoggedIn'])
defineEmits(['add-favorite', 'remove-favorite'])

</script>

<style scoped>

#recipeTitle {
    text-align: left;
    border-bottom: 2px solid #155263;
    border-radius: 3px;
}


#recipeInfo {
    text-align: left;
    font-size: 19px;
}

#ingredients {
    display: flex;

}

#ingredients li {
    margin-left: 5px;
}

.myContainer {
    text-align: left;
}

.myContainer h4 {
    border-bottom: 2px solid #155263;
    border-radius: 3px;
}

.button-styling {
    outline: none;
    border: none;
    color: red;
    font-size: 27px;
    background-color: transparent;
}
</style>