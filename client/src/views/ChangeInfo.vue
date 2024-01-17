<template>
    <Header></Header>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-12 myForm mt-2"> 
                <div class="input-container">
                    <label for="newUsername">New username: </label>
                    <input class="input-styling" type="text" name="newUsername" id="newUsername" v-model="newUserName">
                </div>
                <div class="input-container">
                    <label for="newPassword">New Password: </label>
                    <input class="input-styling" type="password" name="password" id="newPassword" v-model="newPassword">
                </div>
            </div>
        </div>
        <div class="row justify-content-center mt-3">
            <div class="col-12">
                <button @click="cancel()">Cancel</button>
                <button @click="submitChanges()">Submit</button>
            </div>
        </div>
        <div class="row justify-content-center mt-3">
            <div v-if="showWarning" class="col-12 d-flex justify-content-center">
                <div class="warning">
                    <i class="bi bi-dash-circle"></i><span class="ms-2">{{ warningMessage }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from '../components/Header.vue'
import router from '../router';
import { Api } from '../Api';

const newPassword = ref('')
const newUserName = ref('')

let warningMessage = ref('')
let showWarning = ref(false)

async function submitChanges() {

    if(newPassword.value.length < 5) {
        showWarning.value = true
        return warningMessage.value = 'Password must be at least 5 characters'
    }

    if(newUserName.value.length < 3) {
        showWarning.value = true
        return warningMessage.value = 'Username must be at least 3 characters'
    }

    Api.put('/v1/users/:id', {username: newUserName.value, password: newPassword.value}, {
        headers: {
            'x-access-token': localStorage.getItem('x-access-token')
        }
    })
    .then((response) => {
        if(response.status === 200 ) {
            localStorage.removeItem('x-access-token')
            router.push({name: 'Login'})
        }
    })
    .catch((error) => {
        if(error.response.status === 404) {
            console.log(error.response)
        }
        else {
            console.error(error)
        }
    })
}

async function cancel() {
    router.push({name: 'Home'});
}

</script>

<style scoped>

button {
  margin-top: 5px;  
  width: 145px;  
  margin-left: 20px;  
  border-radius: 5px;  
  border: none;  
  outline: none;  
  background-color: #ff6f3c;
  color: #f1f1f1;
}

button:hover {
  background-color: #f1f1f1;
  color: #ff6f3c;
  border: 1px solid #ff6f3c;
}

.myForm {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 500px;
}

.myForm label {
    text-align: left;
}

.input-container {
    display: flex;
    flex-direction: column;

}

.input-styling {
    border: 1px solid #d1d1d1;
    border-radius: 5px;
    outline: none;
}

.input-styling:focus {
    box-shadow: 0 0 12px rgba(255, 111, 60, 0.9);
}

.warning {
  background-color: #f1f1f1;
  color: #ff3232;
  padding: 6px 10px 6px 10px;
  border-radius: 10px;
  border: 2px solid #28282B;
}

</style>