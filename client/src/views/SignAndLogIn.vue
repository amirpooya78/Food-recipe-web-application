<template>
  <Header></Header>
  <LogIn v-if="isLogin" @log-in="loginUser" @toggle-form="toggleForm"></LogIn>
  <SingUp v-else @sign-up="postNewUser" @toggle-form="toggleForm"></SingUp>
  <div class="container">
    <div class="row justify-content-center">
      <div v-if="showWarning" class="col-12 d-flex justify-content-center">
        <div class="warning">
          <i class="bi bi-dash-circle"></i><span class="ms-2">{{ warningMessage }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from '../components/Header.vue'
import LogIn from '../components/LogIn.vue'
import SingUp from '../components/SingUp.vue'
import { Api } from '../Api.js'
import router from '../router'
import { ref } from 'vue'

let showWarning = ref(false)
let warningMessage = ref('')
let isLogin = ref(true)

async function postNewUser(newUser, signAsAuthor) {
  try {
    const response = await Api.post('/v1/users', newUser);

    if (response.status === 201) {
      localStorage.setItem('x-access-token', response.data.token);
      // For users who want to be an author as well
      if(signAsAuthor) {
        Api.post('/v1/authors', {email: response.data.email})
        .then((response) => {
          if(response.status === 201) {
            router.push( {name: 'Home'})
          }
        })
        .catch((error) => {
          if (error.response.status === 409) {
            console.log('Author with given email already exists', error.response)
          }
          else if (error.response.status === 404) {
            console.log(error.response)
          }
          else {
            console.error(error)
          }
        })
      }

      router.push({ name: 'Home' });
    } else if (response.status === 200) {
      showWarning.value = true;
      warningMessage.value = 'User with given email already exists';
    }
  } catch (error) {
    console.error(error);

    if (error.response) {
      if (error.response.status === 400) {
        showWarning.value = true;
        warningMessage.value = 'Invalid password or email format : password must be at least 5 and username should be at least 3 characters';
      } else if (error.response.status === 500) {
        // Internal server error page
      }
    } else {
      console.error('Network error or request failed:', error.message);
    }
  }
}

async function loginUser(oldUser) {
  Api.post('/v1/login', oldUser)
    .then((response) => {
      if (response.status === 200) {
        localStorage.setItem('x-access-token', response.data.token);
        router.push({ path: '/' });
      }
    })
    .catch((error) => {
      console.error(error);
      showWarning.value = true;
      if (error.response.status === 404) {
        warningMessage.value = 'User with given email was not found';
      } else if (error.response.status === 400) {
        warningMessage.value = 'Enter your email and password';
      } else if (error.response.status === 401) {
        warningMessage.value = 'Wrong password!';
      }
    });
}

function toggleForm() {
  isLogin.value = !isLogin.value;
  showWarning.value = false;
  warningMessage.value = '';
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
</style>
