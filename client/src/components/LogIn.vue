<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-lg-8 col-md-12">
        <div>
          <!-- Login Page -->
          <div class="mb-3">
            <h2>Login</h2>
            <div class="form-group">
              <label for="loginUsername">Email:</label>
              <input type="email" class="form-control" id="loginEmail" v-model="loginEmail">
            </div>
            <div class="form-group">
              <label for="loginPassword">Password:</label>
              <input type="password" class="form-control" id="loginPassword" v-model="loginPassword">
            </div>
            <button class="btn mt-3" @click="$emit('log-in', oldUser)">Log In</button>
            <button class="btn mt-3" @click="$emit('toggle-form')">Don't have an account? Sign up</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const loginEmail = ref('')
const loginPassword = ref('')

let oldUser = computed(() => {
  return {
    email: loginEmail.value,
    password: loginPassword.value
  }
}) 
</script>

<style scoped>

input[type="text"]:focus, input[type="email"]:focus, input[type="password"]:focus {
  border: 1px solid #d1d1d1;
  box-shadow: 0 0 12px rgba(255, 111, 60, 0.9);
}

.btn {
background-color: #ff6f3c; 
color: #fff; 
margin-right: 10px; 
margin-bottom: 10px; 
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
</style>


