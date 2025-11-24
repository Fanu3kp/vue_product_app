import { defineStore } from 'pinia';
import axios from 'axios';
import router from '../router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    error: null,
    loading: false,
  }),
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
  },
  actions: {
    async login({ username, password }) {
      // Ensure credentials are correct
      if (!username || !password) {
        this.error = 'Username and password are required';
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        // DummyJSON expects { username, password, expiresInMins } in JSON body
        const res = await axios.post('https://dummyjson.com/auth/login', {
          username,
          password,
          expiresInMins: 30, // optional, defaults to 60
        }, {
          headers: { 'Content-Type': 'application/json' },
        });

        // Save tokens and user info
        this.accessToken = res.data.accessToken;
        this.refreshToken = res.data.refreshToken;
        this.user = {
          id: res.data.id,
          username: res.data.username,
          email: res.data.email,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          gender: res.data.gender,
          image: res.data.image,
        };

        localStorage.setItem('accessToken', this.accessToken);
        localStorage.setItem('refreshToken', this.refreshToken);
        localStorage.setItem('user', JSON.stringify(this.user));

        // Redirect to products page after successful login
        router.push('/products');
      } catch (err) {
        // Handle errors
        this.error = err.response?.data?.message || 'Login failed. Please check your credentials.';
        console.error('Login error:', err.response?.data || err);
      } finally {
        this.loading = false;
      }
    },

    async getCurrentUser() {
      if (!this.accessToken) return null;

      try {
        const res = await axios.get('https://dummyjson.com/auth/me', {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
        });

        this.user = res.data;
        localStorage.setItem('user', JSON.stringify(this.user));
        return res.data;
      } catch (err) {
        console.error('Get current user error:', err);
        // If token is invalid, try to refresh
        await this.refreshSession();
        return null;
      }
    },

    async refreshSession() {
      if (!this.refreshToken) return false;

      try {
        const res = await axios.post('https://dummyjson.com/auth/refresh', {
          refreshToken: this.refreshToken,
          expiresInMins: 30,
        }, {
          headers: { 'Content-Type': 'application/json' },
        });

        this.accessToken = res.data.accessToken;
        this.refreshToken = res.data.refreshToken;

        localStorage.setItem('accessToken', this.accessToken);
        localStorage.setItem('refreshToken', this.refreshToken);

        return true;
      } catch (err) {
        console.error('Refresh session error:', err);
        this.logout();
        return false;
      }
    },

    logout() {
      this.accessToken = null;
      this.refreshToken = null;
      this.user = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      // Also remove old token if it exists
      localStorage.removeItem('token');
      router.push('/login');
    },

    restoreSession() {
      const storedAccessToken = localStorage.getItem('accessToken');
      const storedRefreshToken = localStorage.getItem('refreshToken');
      const storedUser = localStorage.getItem('user');

      if (storedAccessToken) this.accessToken = storedAccessToken;
      if (storedRefreshToken) this.refreshToken = storedRefreshToken;
      if (storedUser) this.user = JSON.parse(storedUser);
    },
  },
});
