<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-primary">Product Management</h1>
          <button
            @click="logout"
            class="btn-secondary"
          >
            <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Search, Filter, and Sort Bar -->
      <div class="mb-6 space-y-4">
        <!-- Row 1: Search and Add Button -->
        <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div class="flex-1 w-full sm:max-w-md">
            <div class="relative">
              <input
                v-model="searchQuery"
                @input="handleSearch"
                type="text"
                placeholder="Search products..."
                class="input-field pl-10"
              />
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <button
            @click="goToAddProduct"
            class="btn-primary whitespace-nowrap w-full sm:w-auto"
          >
            <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </button>
        </div>

        <!-- Row 2: Category Filter and Sort -->
        <div class="flex flex-col sm:flex-row gap-4">
          <select
            v-model="selectedCategory"
            @change="handleCategoryChange"
            class="input-field"
          >
            <option value="all">All Categories</option>
            <option v-for="category in productStore.categories.filter(c => c !== 'all')" :key="category" :value="category">
              {{ formatCategory(category) }}
            </option>
          </select>

          <select
            v-model="sortBy"
            @change="handleSortChange"
            class="input-field"
          >
            <option value="title">Sort by Title</option>
            <option value="price">Sort by Price</option>
            <option value="rating">Sort by Rating</option>
          </select>

          <select
            v-model="sortOrder"
            @change="handleSortChange"
            class="input-field"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <!-- Results Info -->
        <div v-if="!productStore.isLoading && productStore.products.length > 0" class="text-sm text-gray-600">
          Showing {{ (productStore.currentPage - 1) * productStore.itemsPerPage + 1 }} - 
          {{ Math.min(productStore.currentPage * productStore.itemsPerPage, productStore.total) }} 
          of {{ productStore.total }} products
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="productStore.isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p class="mt-4 text-gray-600">Loading products...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="productStore.error" class="text-center py-12">
        <div class="text-red-500 mb-4">
          <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-red-600">{{ productStore.error }}</p>
      </div>

      <!-- Products Grid -->
      <div v-else-if="productStore.products.length > 0" class="space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <ProductCard
            v-for="product in productStore.products"
            :key="product.id"
            :product="product"
            @click="viewProduct"
          />
        </div>

        <!-- Pagination -->
        <div v-if="productStore.totalPages > 1" class="flex justify-center items-center gap-2 mt-8">
          <button
            @click="goToPage(productStore.currentPage - 1)"
            :disabled="productStore.currentPage === 1"
            class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div class="flex gap-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                page === productStore.currentPage
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              ]"
            >
              {{ page }}
            </button>
          </div>

          <button
            @click="goToPage(productStore.currentPage + 1)"
            :disabled="productStore.currentPage === productStore.totalPages"
            class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p class="text-gray-600">No products found</p>
        <p class="text-gray-500 text-sm mt-2">Try adjusting your search or filter</p>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useProductStore } from "../stores/product";
import ProductCard from "../components/ProductCard.vue";

export default {
  name: "Products",
  components: {
    ProductCard
  },
  setup() {
    const router = useRouter();
    const auth = useAuthStore();
    const productStore = useProductStore();
    
    const searchQuery = ref('');
    const selectedCategory = ref('all');
    const sortBy = ref('title');
    const sortOrder = ref('asc');
    let searchTimeout = null;

    // Computed property for visible pagination pages
    const visiblePages = computed(() => {
      const total = productStore.totalPages;
      const current = productStore.currentPage;
      const pages = [];
      
      if (total <= 7) {
        // Show all pages if 7 or fewer
        for (let i = 1; i <= total; i++) {
          pages.push(i);
        }
      } else {
        // Always show first page
        pages.push(1);
        
        if (current > 3) {
          pages.push('...');
        }
        
        // Show pages around current
        for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
          pages.push(i);
        }
        
        if (current < total - 2) {
          pages.push('...');
        }
        
        // Always show last page
        pages.push(total);
      }
      
      return pages;
    });

    // Load categories and products on mount
    onMounted(async () => {
      await productStore.fetchCategories();
      await productStore.fetchProducts();
    });

    // Watch for changes that should trigger a refetch
    watch([() => productStore.currentPage, () => productStore.sortBy, () => productStore.sortOrder], () => {
      productStore.fetchProducts();
    });

    const handleSearch = () => {
      // Debounce search to avoid too many API calls
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        productStore.setSearchQuery(searchQuery.value);
        productStore.fetchProducts();
      }, 500);
    };

    const handleCategoryChange = () => {
      productStore.setCategory(selectedCategory.value);
      productStore.fetchProducts();
    };

    const handleSortChange = () => {
      productStore.setSorting(sortBy.value, sortOrder.value);
      productStore.fetchProducts();
    };

    const goToPage = (page) => {
      if (page === '...' || page < 1 || page > productStore.totalPages) return;
      productStore.setPage(page);
      // fetchProducts will be called by the watcher
    };

    const viewProduct = (product) => {
      router.push(`/products/${product.id}`);
    };

    const goToAddProduct = () => {
      router.push('/products/new');
    };

    const logout = () => {
      auth.logout();
    };

    const formatCategory = (category) => {
      return category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    return {
      auth,
      productStore,
      searchQuery,
      selectedCategory,
      sortBy,
      sortOrder,
      visiblePages,
      handleSearch,
      handleCategoryChange,
      handleSortChange,
      goToPage,
      viewProduct,
      goToAddProduct,
      logout,
      formatCategory,
    };
  },
};
</script>
