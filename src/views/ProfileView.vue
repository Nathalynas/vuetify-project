<template>
  <v-app>
    <SidebarDrawer />
    <v-main class="pa-6">
      <v-container>

        <v-card class="mb-6 px-6 py-4" elevation="0" color="#994EFE" rounded>
                    <h2 class="text-white text-h6 font-weight-bold">
                        Perfil do Usuário
                    </h2>
                </v-card>

        <v-card class="pa-6" elevation="2" rounded>
          <v-row justify="center">
            <v-avatar size="100" color="#994EFE">
              <v-icon size="60" color="white">mdi-account</v-icon>
            </v-avatar>
          </v-row>

          <v-row class="mt-6" justify="center">
            <v-col cols="12" md="6" class="text-center">
              <h3 class="text-h6 font-weight-bold">{{ name }}</h3>
              <p class="text-subtitle-2">{{ email }}</p>
              <v-btn color="#994EFE" class="mt-4 font-weight-bold" @click="showEditDialog = true">
                Editar Perfil
              </v-btn>
            </v-col>
          </v-row>
        </v-card>

        <v-dialog v-model="showEditDialog" max-width="500">
          <v-card>
            <v-card-title>Editar Perfil</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="form.name"
                label="Nome"
                :rules="[v => !!v || 'Campo obrigatório']"
              />
              <v-text-field
                v-model="form.old_password"
                label="Senha Atual"
                type="password"
                :rules="[v => v.length >= 6 || 'Mínimo 6 caracteres']"
              />
              <v-text-field
                v-model="form.new_password"
                label="Nova Senha"
                type="password"
                :rules="[v => v.length >= 6 || 'Mínimo 6 caracteres']"
              />
            </v-card-text>
            <v-card-actions>
              <v-btn text @click="cancelEdit">Cancelar</v-btn>
              <v-btn color="#994EFE" @click="saveProfile">Salvar</v-btn>
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
import { ref, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import { getUser, updateUser } from '../services/profileService'

const name = ref('Carregando...')
const email = ref('Carregando...')
const showEditDialog = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('green')

const form = ref({
  name: '',
  old_password: '',
  new_password: '',
})

async function loadUserData() {
  try {
    const user = await getUser()
    name.value = user.name
    email.value = user.email
    form.value.name = user.name
  } catch (err) {
    name.value = 'Erro ao carregar'
    email.value = '---'
  }
}

function cancelEdit() {
  showEditDialog.value = false
  form.value.old_password = ''
  form.value.new_password = ''
}

async function saveProfile() {
  try {
    await updateUser({
      name: form.value.name,
      old_password: form.value.old_password,
      new_password: form.value.new_password,
    })
    snackbarText.value = 'Perfil atualizado com sucesso'
    snackbarColor.value = 'green'
    snackbar.value = true
    showEditDialog.value = false
    await loadUserData()
  } catch (e) {
    snackbarColor.value = 'red'
    if (e.response?.status === 401) {
      snackbarText.value = 'Senha atual incorreta'
    } else if (e.response?.status === 404) {
      snackbarText.value = 'A nova senha não pode ser igual à anterior'
    } else {
      snackbarText.value = 'Erro ao atualizar perfil'
    }
    snackbar.value = true
  }
}

onMounted(loadUserData)
</script>
