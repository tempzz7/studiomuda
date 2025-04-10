<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center justify-space-between">
            <span class="text-h5">Inventário</span>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="dialog = true">
              Adicionar Item
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="items"
              :loading="loading"
              class="elevation-1"
            >
              <template v-slot:item.actions="{ item }">
                <v-icon
                  size="small"
                  class="me-2"
                  @click="editItem(item)"
                >
                  mdi-pencil
                </v-icon>
                <v-icon
                  size="small"
                  @click="deleteItem(item)"
                >
                  mdi-delete
                </v-icon>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editingId ? 'Editar Item' : 'Novo Item' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.name"
                  label="Nome do Item*"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.sku"
                  label="SKU/Código"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.quantity"
                  label="Quantidade*"
                  type="number"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.price"
                  label="Preço"
                  type="number"
                  prefix="R$"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="formData.description"
                  label="Descrição"
                  rows="3"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
          <small>*Campos obrigatórios</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeDialog">
            Cancelar
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="saveItem">
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Confirmar exclusão</v-card-title>
        <v-card-text>
          Tem certeza que deseja excluir este item?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" variant="text" @click="confirmDelete">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/inventory';

// Data table
const loading = ref(true);
const items = ref([]);
const headers = [
  { title: 'Nome', key: 'name' },
  { title: 'SKU', key: 'sku' },
  { title: 'Quantidade', key: 'quantity' },
  { title: 'Preço', key: 'price', format: value => `R$ ${value.toFixed(2)}` },
  { title: 'Ações', key: 'actions', sortable: false }
];

// Form data
const dialog = ref(false);
const deleteDialog = ref(false);
const editingId = ref(null);
const itemToDelete = ref(null);
const formData = reactive({
  name: '',
  sku: '',
  quantity: 0,
  price: 0,
  description: ''
});

// Fetch inventory data
const fetchInventory = async () => {
  loading.value = true;
  try {
    const response = await axios.get(API_URL);
    items.value = response.data;
  } catch (error) {
    console.error('Error fetching inventory:', error);
    alert('Erro ao carregar inventário');
  } finally {
    loading.value = false;
  }
};

// Reset form
const resetForm = () => {
  formData.name = '';
  formData.sku = '';
  formData.quantity = 0;
  formData.price = 0;
  formData.description = '';
  editingId.value = null;
};

// Close dialog
const closeDialog = () => {
  dialog.value = false;
  resetForm();
};

// Edit item
const editItem = (item) => {
  editingId.value = item._id;
  formData.name = item.name;
  formData.sku = item.sku;
  formData.quantity = item.quantity;
  formData.price = item.price;
  formData.description = item.description;
  dialog.value = true;
};

// Delete item
const deleteItem = (item) => {
  itemToDelete.value = item;
  deleteDialog.value = true;
};

// Confirm delete
const confirmDelete = async () => {
  if (!itemToDelete.value) return;
  
  try {
    await axios.delete(`${API_URL}/${itemToDelete.value._id}`);
    await fetchInventory();
    deleteDialog.value = false;
    itemToDelete.value = null;
  } catch (error) {
    console.error('Error deleting item:', error);
    alert('Erro ao excluir item');
  }
};

// Save item
const saveItem = async () => {
  try {
    if (editingId.value) {
      // Update existing item
      await axios.put(`${API_URL}/${editingId.value}`, formData);
    } else {
      // Create new item
      await axios.post(API_URL, formData);
    }
    await fetchInventory();
    closeDialog();
  } catch (error) {
    console.error('Error saving item:', error);
    alert('Erro ao salvar item');
  }
};

// Load data on component mount
onMounted(fetchInventory);
</script>
