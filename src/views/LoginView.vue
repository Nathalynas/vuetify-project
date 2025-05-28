<template>
  <v-app>
    <v-main class="login-background">
      <v-container class="d-flex justify-center align-center fill-height">
        <v-card class="pa-6 login-card" width="100%" max-width="400" elevation="10">
          <v-img src="/src/assets/logo.png" height="130" class="mb-4" contain />

          <v-alert v-if="error" type="error" variant="tonal" class="mb-4" dense>
            {{ error }}
          </v-alert>

          <v-form @submit.prevent="onLogin" v-model="formValid">
            <v-text-field v-model="form.email" label="Email" type="email" :rules="[rules.required, rules.email]"
              prepend-inner-icon="mdi-email" required />
            <v-text-field v-model="form.password" label="Senha" type="password" :rules="[rules.required, rules.min(6)]"
              prepend-inner-icon="mdi-lock" required />

            <div class="mb-2">
              <div class="text-start">
                <span @click="showForgotPasswordDialog"
                  style="cursor: pointer; color: red; text-decoration: underline; font-size: 14px;">
                  Esqueci a senha
                </span>
              </div>

              <v-checkbox v-model="stayConnected" label="Permanecer conectado" density="compact" hide-details />
            </div>

            <v-btn :loading="loading" type="submit" color="#994EFE" block class="my-2">
              Entrar
            </v-btn>

            <v-btn variant="text" block @click="$router.push('/signup')">
              Criar uma conta
            </v-btn>
          </v-form>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({ email: '', password: '' })
const stayConnected = ref(false)
const loading = ref(false)
const error = ref('')
const formValid = ref(false)

const rules = {
  required: v => !!v || 'Obrigatório',
  email: v => /.+@.+\..+/.test(v) || 'Email inválido',
  min: len => v => (v && v.length >= len) || `Mínimo de ${len} caracteres`,
}

const onLogin = async () => {
  loading.value = true
  error.value = ''
  try {

    const response = await fetch('https://estagio.almt.app/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      credentials: 'include',
      body: JSON.stringify({
        email: form.value.email,
        password: form.value.password,
      }),
    })

    if (!response.ok) throw new Error('Credenciais inválidas')


    const data = await response.json()
    localStorage.setItem('token', data.token)
    if (stayConnected.value) {
      localStorage.setItem('stayConnected', 'true')
    }

    window.location.href = '/produtos'
  } catch (err) {
    error.value = err.message || 'Erro ao fazer login'
  } finally {
    loading.value = false
  }
}

const showForgotPasswordDialog = () => {
  alert('Abrir modal de recuperação de senha (a ser implementado)')
}
</script>