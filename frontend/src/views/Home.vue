<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h4 font-weight-bold">
            Studio Muda - Sistema de Inventário
          </v-card-title>
          <v-card-text>
            <p class="text-body-1">
              Bem-vindo ao sistema de gerenciamento de inventário do Studio Muda.
            </p>
            <p class="text-body-1 mt-4">
              Use o menu de navegação para acessar os recursos do sistema.
            </p>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              :to="{ name: 'Inventory' }"
            >
              Ver Inventário
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  console.log('Home view mounted');
});
</script>
