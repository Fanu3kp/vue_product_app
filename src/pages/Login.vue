<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-gray-900">Welcome Back</h2>
        <p class="text-gray-600 mt-2">Sign in to your account</p>
      </div>

      <!-- Error message -->
      <div v-if="auth.error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-600 text-sm">{{ auth.error }}</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <!-- Username -->
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            v-model="username"
            id="username"
            type="text"
            placeholder="Enter your username"
            class="input-field"
            required
          />
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            v-model="password"
            id="password"
            type="password"
            placeholder="Enter your password"
            class="input-field"
            required
          />
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="auth.loading"
          class="btn-primary w-full"
        >
          <span v-if="auth.loading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          </span>
          <span v-else>Sign In</span>
        </button>
      </form>

      <!-- Demo credentials -->
      <div class="mt-6 p-4 bg-blue-50 rounded-lg">
        <p class="text-sm text-gray-700 text-center">
          <span class="font-medium">Demo Credentials:</span><br>
          <span class="font-mono text-primary">emilys / emilyspass</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

export default {
  name: 'Login',
  setup() {
    const username = ref('');
    const password = ref('');
    const auth = useAuthStore();

    const handleLogin = () => {
      auth.login({ username: username.value, password: password.value });
    };

    return {
      username,
      password,
      auth,
      handleLogin,
    };
  },
};
</script>
