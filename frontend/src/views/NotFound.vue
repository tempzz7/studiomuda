<template>
  <v-container class="text-center">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h2 mb-6">404</h1>
        <h2 class="text-h4 mb-6">Página não encontrada</h2>
        <p class="text-body-1 mb-8">A página que você está tentando acessar não existe.</p>
        <v-btn
          color="primary"
          :to="{ name: 'Home' }"
          size="large"
        >
          Voltar para Home
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// No additional logic needed
</script>
