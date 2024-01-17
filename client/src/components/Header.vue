<template>
    <div class="container-fluid">
        <div class="row align-items-center justify-content-between" style="height: 90px; background-color: #155263;">
            <div class="col d-flex" @click="openMenu()">
                <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" fill="#f1f1f1" class="bi bi-list" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                </svg>
            </div>
            <div class="col">
                <img class="img-fluid mt-3" src="../front-end-images/logo.png.png" alt="logo" style="width: 70px; height: 70px;">
            </div>
            <div class="col d-flex justify-content-end">
                <div class="me-2">
                    <!--Usr profile picture-->
                    <div v-if="user.isLoggedIn">
                        <a href="javascript:void(0)" @click="toggleDropdown" role="button"><img src="../front-end-images/blank-profile-picture.png" alt="user profile picture" style="height: 30px; width: 30px; border-radius: 50%;"></a>
                        <div id="dropdown-content" class="p-2">
                            <div id="user-name-container">
                                <label for="username" id="user-label">Username</label>
                                <input type="text" id="username" class="input-styling" :disabled="!isEditing" :value="user.username"> 
                                <button v-if="!isEditing" class="button-styling my-2" @click="editUsername" style="background-color: #155263; border: none;">Edit</button>
                                <div v-else class="d-flex my-2">
                                    <button class="button-styling me-1" @click="submitNewUsername" style="color: #50C878;"> <i class="bi bi-check-circle"></i> </button>
                                    <button class="button-styling" @click="cancelEditing" style="color: red;"> <i class="bi bi-x-circle"></i> </button>
                                </div>
                            </div>
                            <li class="item-of-dropdown"><a href="javascript:void(0)" @click="logOut"> Log out </a></li>
                        </div>
                    </div>
                    <!--Login button-->
                    <div v-else> <router-link :to="{name: 'Login'}" class="btn" id="loginButton"><i class="bi bi-box-arrow-in-right" style="font-size: 25px; color: #f1f1f1;"></i></router-link></div>
                </div>
            </div>
            <div class="overlay" id="menu">
                <a type="button" href="javascript:void(0)" @click="closeMenu()" class="closebtn" aria-label="Close">&times;</a>
                <div class="menu-items text-center">
                    <li> <router-link :to= "{ name: 'Home' }"> Home </router-link> </li>
                    <!--Change this to favorite recipes page later on-->
                    <li v-if="user.isLoggedIn"><router-link :to="{path: user.favorite_recipes.href }"> Favorite recipes </router-link></li> 
                    <!--Change this :to to AddRecipe leter-->
                    <li v-if="user.isAuthor"><router-link :to="{ name: 'NewRecipe' }"> Add a new recipe </router-link></li>
                    <li v-if="user.isLoggedIn"><router-link :to="{ name: 'ChangeInfo'}"> Change username and password </router-link></li>
                    <li v-if="!user.isLoggedIn"> <router-link :to= "{ name: 'Login' }"> Login </router-link></li>
                    <li v-else @click="logOut"> <router-link :to="{ name: 'Home'}">Log out</router-link></li>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import router from '../router';
import { Api } from '../Api';

const user = ref({isLoggedIn: false, isAuthor: false});

const isEditing = ref(false)

function editUsername() {
    isEditing.value = true
}

function cancelEditing() {
    isEditing.value = false
}

async function submitNewUsername() {
    let newUsername = document.getElementById('username').value

    if(newUsername.length < 3) {
        return alert('Username must be at least 3 characters')
    }

    isEditing.value = false

    Api.patch(`/v1/users/${user.value._id}`, {username: newUsername}, {
        headers: {
            'x-access-token': localStorage.getItem('x-access-token')
        }
    })
    .then((response) => {
        if(response.status === 200) {
            user.value.username = response.data.username
        }
    })
    .catch((error) => {
        if(error.response.status === 404) {
            console.log(error.response.data)
        }
        if(error.response.status === 403) {
            localStorage.removeItem('x-access-token')
            router.push('Home')
        }
    })
}

function openMenu() {
    document.getElementById("menu").style.visibility = "visible"  
    document.getElementById("menu").style.width = "120%"
    document.getElementById("menu").style.translate = "0px 0px"
}

function closeMenu() {
    document.getElementById("menu").style.width = "0%"
    document.getElementById("menu").style.translate = "-30px 0px"
}

function toggleDropdown() {
    const dropdown = document.getElementById("dropdown-content")

    if(dropdown.style.display === "block"){
        dropdown.style.display = "none"
    }else {
        dropdown.style.display = "block"
    }
}

function logOut() {
    localStorage.removeItem('x-access-token')
    user.value = {isLoggedIn: false, isAuthor: false}

    router.push({name: 'Home'})
}


onMounted(async () => {
    const token = localStorage.getItem('x-access-token')

    try{ 
        if(token){
            const response = await Api.get('/v1/users/:id', {
                headers: {
                    'x-access-token': token
                }
            })

            if(response.status === 200){
                user.value = { ...response.data, isLoggedIn: true };
                // Check if recived user is also an author
                Api.get('/v1/authors/:userId', {
                    headers: {
                        'x-access-token': token
                    }
                })
                .then((response) => {
                    if (response.status === 200) {
                        user.value = { ...user.value, isAuthor: true}
                    }
                })
                .catch((error) => {
                    if(error.response.status === 404){ 
                        user.value = { ...user.value, isAuthor: false}
                    }
                })
            }
        }
    }
    catch(error) {
        // if access token is expired or not verified for any other reason we log it we remove it from the uses's
        // localStorage
        if (error.response.status === 403 || error.response.status === 404) {
            localStorage.removeItem('x-access-token')
        }
    }

})


</script>

<style scoped>

#user-label{ 
    text-align: left;
}

.input-styling {
    outline: none;
    border: 1px solid #808080;
    border-radius: 20px;
    padding: 3px 4px 3px 4px;
    background-color: #000000;
    color: #f1f1f1;
}


.button-styling {
    background-color: #000000;
    border: 1px solid inherit;
    border-radius: 20px;
    padding: 2px;
    color: #d1d1d1;
    flex-grow: 1;
    font-weight: bold;
}
.input-styling:disabled {
    background-color: #808080;
    color: #000000;
}

#user-name-container {
    display: flex;
    flex-direction: column;
}

#loginButton{
    padding: 0 8px 0px 2px; 
    margin: 0;
    background-color: #155263;
    text-decoration: none;
    box-shadow: none;
}

.overlay {
    visibility: hidden;
    height: 100%;
    width: 0%;
    position: fixed;
    overflow-x: hidden;
    top: 0;
    left: 0;
    z-index: 1;
    background-color: rgba(0,0,0, 0.9);
    transition: 0.5s;
}

.menu-items{
    position: relative;
    top: 25%;
    width: 100%;
    margin-top: 30px;
    text-align: center;
}

.overlay .closebtn {
  position: absolute;
  top: 20px;
  right: 2%;
  font-size: 50px;
  color: #f1f1f1;
}

.menu-items li {
    list-style: none;
}

.overlay a {
    padding: 6px;
    text-decoration: none;
    text-align: center;
    color: #818181;
    display: block;
    font-size: 32px;
}

.overlay a:hover {
    color:  #f1f1f1;
}

.item-of-dropdown{
    color: #f1f1f1;
    font-weight: bold;
    text-decoration: none;
    background-color: red;
    list-style: none;
    padding: 2px;
    border-radius: 20px; 
}

.item-of-dropdown a {
    text-decoration: none;
    color: #f1f1f1;
}

#dropdown-content {
    display: none;
    position: absolute;
    right: 1%;
    background-color: black;
    min-width: 180px;
    border: 1px solid #000000 ;
    border-radius: 20px;
    margin-top: 5px;
    padding: 5px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
}

</style>
