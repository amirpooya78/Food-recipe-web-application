<template>
  <Header></Header>
  <div class="error-container">
    <h1 class="code">404</h1>
    <h2 class="message">This page doesn't exist</h2>
  </div>
</template>

<script setup>
import Header from '../components/Header.vue'

</script>

<style scoped>
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f8f8f8;
}

.code {
  font-size: 3rem;
  color: #f44336; 
  margin-bottom: 10px;
}

.message {
  font-size: 1.5rem;
  color: #333; 
}
</style>
