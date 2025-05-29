<template>
    <v-app>
        <SidebarDrawer />
        <v-main class="pa-6">
            <v-container>

                <v-card class="mb-6 px-6 py-4" elevation="0" color="#994EFE" rounded>
                    <h2 class="text-white text-h6 font-weight-bold">
                        Listagem de Produtos
                    </h2>
                </v-card>

                <v-row class="mb-4" align="center">
                    <v-col cols="12" md="9">
                        <v-text-field v-model="search" label="Pesquisar Produto" variant="outlined" dense
                            hide-details />
                    </v-col>
                    <v-col cols="12" md="3" class="d-flex justify-end align-center">
                        <v-btn color="#994EFE" class="font-weight-bold" @click="showCreateDialog = true" height="40"
                            min-width="160">
                            NOVO PRODUTO
                        </v-btn>
                    </v-col>
                </v-row>

                <v-data-table :items="filteredProducts" :items-per-page="5" class="elevation-1 custom-header">
                    <template #headers>
                        <tr>
                            <th>Código</th>
                            <th>Nome</th>
                            <th>Categoria</th>
                            <th>Quantidade</th>
                            <th>Valor de Venda</th>
                            <th>Ações</th>
                        </tr>
                    </template>

                    <template #item="{ item }">
                        <tr>
                            <td>{{ item.id }}</td>
                            <td>{{ item.name }}</td>
                            <td>{{ item.category_type }}</td>
                            <td>{{ item.quantity }}</td>
                            <td>R$ {{ item.value.toFixed(2) }}</td>
                            <td>
                                <v-icon class="me-2" color="grey" @click="editProduct(item)" style="cursor: pointer">
                                    mdi-pencil
                                </v-icon>
                                <v-icon color="red" @click="confirmDelete(item)" style="cursor: pointer">
                                    mdi-delete
                                </v-icon>
                            </td>
                        </tr>
                    </template>
                </v-data-table>

                <v-dialog v-model="showCreateDialog" max-width="400">
                    <v-card>
                        <v-card-title>{{ editingProduct ? 'Editar' : 'Novo' }} Produto</v-card-title>
                        <v-card-text>
                            <v-text-field v-model="form.name" label="Nome" :rules="[v => !!v || 'Campo obrigatório']" />
                            <v-select v-model="form.category_type" :items="['Vestido', 'Calça', 'Camiseta']"
                                label="Categoria" required :rules="[v => !!v || 'Campo obrigatório']" />
                            <v-text-field v-model="form.quantity" label="Quantidade" type="number"
                                :rules="[v => !!v || 'Campo obrigatório']" />
                            <v-text-field v-model="form.value" label="Preço" type="number"
                                :rules="[v => !!v || 'Campo obrigatório']" />
                        </v-card-text>
                        <v-card-actions>
                            <v-btn text @click="cancelEdit">Cancelar</v-btn>
                            <v-btn color="#994EFE" @click="saveProduct">Salvar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
                    {{ snackbarText }}
                </v-snackbar>
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../services/productService.js'

const products = ref([])
const search = ref('')
const showCreateDialog = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const editingProduct = ref(null)
const snackbarColor = ref('green')

const form = ref({
    name: '',
    category_type: '',
    quantity: 0,
    value: 0,
})

const headers = [
    { text: 'Código', value: 'id' },
    { text: 'Nome', value: 'name' },
    { text: 'Categoria', value: 'category_type' },
    { text: 'Quantidade', value: 'quantity' },
    { text: 'Valor de Venda', value: 'value' },
    { text: 'Ações', value: 'actions', sortable: false, align: 'end' },
]

const filteredProducts = computed(() =>
    products.value.filter(p =>
        p.name.toLowerCase().includes(search.value.toLowerCase())
    )
)

async function loadProducts() {
    products.value = await fetchProducts()
}

function editProduct(product) {
    editingProduct.value = product
    form.value = { ...product }
    showCreateDialog.value = true
}

function resetForm() {
    form.value = { name: '', category_type: '', quantity: 0, value: 0 }
    editingProduct.value = null
}
function cancelEdit() {
    resetForm()
    showCreateDialog.value = false
}

async function saveProduct() {
    const price = parseFloat(form.value.value)
    const quantity = parseInt(form.value.quantity)

    if (isNaN(price) || price <= 0) {
        snackbarText.value = 'Preço inválido. Insira um valor maior que zero.'
        snackbarColor.value = 'red'
        snackbar.value = true
        return
    }

    if (isNaN(quantity) || quantity <= 0) {
        snackbarText.value = 'Quantidade inválida. Insira um valor maior que zero.'
        snackbarColor.value = 'red'
        snackbar.value = true
        return
    }

    form.value.value = price
    form.value.quantity = quantity

    if (editingProduct.value) {
        await updateProduct(editingProduct.value.id, form.value)
        snackbarText.value = 'Produto atualizado com sucesso'
    } else {
        await createProduct(form.value)
        snackbarText.value = 'Produto criado com sucesso'
    }

    snackbarColor.value = 'green'
    snackbar.value = true
    showCreateDialog.value = false
    cancelEdit()
    await loadProducts()
}

async function confirmDelete(product) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        await deleteProduct(product.id)
        snackbarText.value = 'Produto excluído com sucesso'
        snackbar.value = true
        await loadProducts()
    }
}

onMounted(loadProducts)
</script>
