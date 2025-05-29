<template>
  <v-navigation-drawer app permanent>
  <v-list dense nav class="d-flex flex-column h-100">
    <v-list-item-title class="px-4 py-3 font-weight-bold text-white" style="background-color: #994EFE">
      {{ accountName || 'Empresa' }}
    </v-list-item-title>

    <v-divider class="my-2" />

    <v-list-item prepend-icon="mdi-shopping-bag" title="Produtos" @click="$router.push('/produtos')" />
    <v-list-item prepend-icon="mdi-account-group" title="Usuários" @click="$router.push('/usuarios')" />
    <v-list-item prepend-icon="mdi-account" title="Perfil" @click="$router.push('/perfil')" />

    <div class="mt-auto">

      <v-list-item
        :prepend-icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        :title="isDark ? 'Tema Claro' : 'Tema Escuro'"
        @click="toggleTheme"
      />

      <v-list-item
        prepend-icon="mdi-translate"
        :title="currentLang === 'pt' ? 'Idioma: Português' : 'Language: English'"
        @click="toggleLanguage"
      />

      <v-divider class="my-2" />

      <v-list-item prepend-icon="mdi-logout" title="Sair" @click="confirmLogout" />
    </div>
  </v-list>
</v-navigation-drawer>

  <v-dialog v-model="logoutDialog" max-width="400">
    <v-card>
      <v-card-title>Confirmação</v-card-title>
      <v-card-text>Deseja realmente sair?</v-card-text>
      <v-card-actions>
        <v-btn text @click="logoutDialog = false">Cancelar</v-btn>
        <v-btn color="error" @click="logout">Sair</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useTheme } from 'vuetify'
import { ref, onMounted } from 'vue'

const theme = useTheme()
const isDark = ref(theme.global.name.value === 'dark')

function toggleTheme() {
  theme.global.name.value = isDark.value ? 'light' : 'dark'
  isDark.value = !isDark.value
}

const currentLang = ref(localStorage.getItem('lang') || 'pt')

function toggleLanguage() {
  currentLang.value = currentLang.value === 'pt' ? 'en' : 'pt'
  localStorage.setItem('lang', currentLang.value)
  location.reload()
}

const logoutDialog = ref(false)
const accountName = ref('')

function confirmLogout() {
  logoutDialog.value = true
}

function logout() {
  logoutDialog.value = false
  localStorage.clear()
  window.location.href = '/login'
}

onMounted(async () => {
  try {
    const res = await fetch('https://estagio.almt.app/accounts', {
      credentials: 'include',
    })
    const data = await res.json()
    const account = data[0]
    accountName.value = account.name
    localStorage.setItem('accountId', account.id)
  } catch (err) {
    console.error('Erro ao buscar conta:', err)
  }
})
</script>
