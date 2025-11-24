import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './auth';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    categories: [],
    isLoading: false,
    error: null,
    searchQuery: '',
    selectedCategory: 'all',
    sortBy: 'title',
    sortOrder: 'asc',
    currentPage: 1,
    itemsPerPage: 12,
    total: 0,
  }),

  getters: {
    totalPages: (state) => Math.ceil(state.total / state.itemsPerPage),
    skip: (state) => (state.currentPage - 1) * state.itemsPerPage,
  },

  actions: {
    // Set search query
    setSearchQuery(query) {
      this.searchQuery = query;
      this.currentPage = 1; // Reset to first page on search
    },

    // Set selected category
    setCategory(category) {
      this.selectedCategory = category;
      this.currentPage = 1; // Reset to first page on category change
    },

    // Set sorting
    setSorting(sortBy, sortOrder = 'asc') {
      this.sortBy = sortBy;
      this.sortOrder = sortOrder;
      this.currentPage = 1; // Reset to first page on sort change
    },

    // Set page
    setPage(page) {
      this.currentPage = page;
    },

    // Fetch categories from API
    async fetchCategories() {
      try {
        const res = await axios.get('https://dummyjson.com/products/category-list');
        this.categories = ['all', ...res.data];
      } catch (err) {
        console.error('fetchCategories error:', err);
        this.categories = ['all'];
      }
    },

    // Fetch all products with server-side filtering, search, pagination, and sorting
    async fetchProducts() {
      this.isLoading = true;
      this.error = null;
      try {
        const authStore = useAuthStore();
        const headers = authStore.accessToken ? { Authorization: `Bearer ${authStore.accessToken}` } : {};

        let url = '';
        const params = new URLSearchParams();

        // Add pagination
        params.append('limit', this.itemsPerPage.toString());
        params.append('skip', this.skip.toString());

        // Add sorting
        if (this.sortBy) {
          params.append('sortBy', this.sortBy);
          params.append('order', this.sortOrder);
        }

        // Determine the endpoint based on search and category
        if (this.searchQuery) {
          // Use search endpoint
          url = `https://dummyjson.com/products/search?q=${encodeURIComponent(this.searchQuery)}`;
        } else if (this.selectedCategory && this.selectedCategory !== 'all') {
          // Use category endpoint
          url = `https://dummyjson.com/products/category/${encodeURIComponent(this.selectedCategory)}`;
        } else {
          // Use default products endpoint
          url = 'https://dummyjson.com/products';
        }

        // Append pagination and sorting params
        url += (url.includes('?') ? '&' : '?') + params.toString();

        const res = await axios.get(url, { headers });
        this.products = res.data.products;
        this.total = res.data.total;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to load products';
        console.error('fetchProducts error:', err);
      } finally {
        this.isLoading = false;
      }
    },

    // Fetch single product by ID
    async fetchProductById(id) {
      this.isLoading = true;
      this.error = null;
      try {
        const authStore = useAuthStore();
        const headers = authStore.accessToken ? { Authorization: `Bearer ${authStore.accessToken}` } : {};

        const res = await axios.get(`https://dummyjson.com/products/${id}`, { headers });
        return res.data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch product';
        console.error('fetchProductById error:', err);
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    // Add a new product
    async addProduct(payload) {
      this.isLoading = true;
      this.error = null;
      try {
        const authStore = useAuthStore();
        const headers = authStore.accessToken ? { Authorization: `Bearer ${authStore.accessToken}` } : {};

        const res = await axios.post('https://dummyjson.com/products/add', payload, { headers });
        // Refresh the product list after adding
        await this.fetchProducts();
        return res.data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to add product';
        console.error('addProduct error:', err);
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    // Update a product
    async updateProduct(id, payload) {
      this.isLoading = true;
      this.error = null;
      try {
        const authStore = useAuthStore();
        const headers = authStore.accessToken ? { Authorization: `Bearer ${authStore.accessToken}` } : {};

        const res = await axios.put(`https://dummyjson.com/products/${id}`, payload, { headers });
        // Update the product in the local array
        const index = this.products.findIndex(p => p.id === Number(id));
        if (index !== -1) {
          this.products[index] = res.data;
        }
        return res.data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to update product';
        console.error('updateProduct error:', err);
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    // Delete a product
    async deleteProduct(id) {
      this.isLoading = true;
      this.error = null;
      try {
        const authStore = useAuthStore();
        const headers = authStore.accessToken ? { Authorization: `Bearer ${authStore.accessToken}` } : {};

        await axios.delete(`https://dummyjson.com/products/${id}`, { headers });
        // Remove from local array
        this.products = this.products.filter(p => p.id !== id);
        this.total = Math.max(0, this.total - 1);
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to delete product';
        console.error('deleteProduct error:', err);
        return false;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
