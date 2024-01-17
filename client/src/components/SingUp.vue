<template>
<div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-lg-8 col-md-12">
        <div>
          <!-- Signup Page -->
          <div class="mb-3">
            <h2>Sign Up</h2>
            <div class="form-group">
              <label for="username">Username:</label>
              <input type="text" class="form-control" id="username" v-model="signupUsername">
            </div>
            <div class="form-group">
              <label for="password">Password:</label>
              <input type="password" class="form-control" id="password" v-model="signupPassword">
            </div>
            <div class="form-group">
              <label for="email">Email Address:</label>
              <input type="email" class="form-control" id="email" v-model="signupEmail">
            </div>
            <div class="form-group mt-3">
              <input type="checkbox" id="sign-as-author" v-model="signAsAuthor">
              <label for="sign-as-author"> Sign up as an author </label>
            </div>
            <button class="btn mt-3" @click="$emit('sign-up', newUser, signAsAuthor)">Sign Up</button>
            <button class="btn mt-3" @click="$emit('toggle-form')">Already have an account? Log in</button>
          </div>
        </div>
      </div>
    </div>
</div>
</template>

<script setup>
import { ref, computed } from 'vue'

const signupUsername = ref('')
const signupPassword = ref('')
const signupEmail = ref('')
const signAsAuthor = ref(false)

let newUser = computed(() => {
  return {
    username: signupUsername.value,
    email: signupEmail.value,
    password: signupPassword.value 
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