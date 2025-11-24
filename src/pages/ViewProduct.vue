<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          @click="goBack"
          class="btn-secondary"
        >
          <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Products
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p class="mt-4 text-gray-600">Loading product...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="text-red-500 mb-4">
          <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-red-600">{{ error }}</p>
      </div>

      <!-- Product Details -->
      <div v-else class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          <!-- Product Images -->
          <div>
            <div class="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
              <img 
                :src="currentImage" 
                :alt="product.title"
                class="w-full h-full object-cover"
              />
            </div>
            
            <!-- Image Thumbnails -->
            <div v-if="product.images && product.images.length > 1" class="grid grid-cols-4 gap-2">
              <div 
                v-for="(image, index) in product.images" 
                :key="index"
                @click="currentImage = image"
                class="aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer border-2 transition-colors"
                :class="currentImage === image ? 'border-primary' : 'border-transparent hover:border-gray-300'"
              >
                <img :src="image" :alt="`${product.title} ${index + 1}`" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <!-- Product Information -->
          <div>
            <div class="mb-6">
              <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ product.title }}</h1>
              <p class="text-gray-600">{{ product.description }}</p>
            </div>

            <!-- Price and Rating -->
            <div class="mb-6 pb-6 border-b">
              <div class="flex items-baseline gap-3 mb-3">
                <span class="text-4xl font-bold text-primary">${{ product.price }}</span>
                <span v-if="product.discountPercentage" class="text-lg text-green-600 font-medium">
                  {{ product.discountPercentage }}% off
                </span>
              </div>
              
              <div class="flex items-center gap-4">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span class="font-medium">{{ product.rating || 'N/A' }}</span>
                </div>
                
                <span class="text-gray-500">|</span>
                
                <span class="text-gray-600">
                  <span :class="product.stock > 0 ? 'text-green-600' : 'text-red-600'" class="font-medium">
                    {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
                  </span>
                </span>
              </div>
            </div>

            <!-- Product Details -->
            <div class="space-y-4 mb-6">
              <div v-if="product.brand" class="flex justify-between">
                <span class="text-gray-600">Brand:</span>
                <span class="font-medium text-gray-900">{{ product.brand }}</span>
              </div>
              
              <div v-if="product.category" class="flex justify-between">
                <span class="text-gray-600">Category:</span>
                <span class="font-medium text-gray-900">{{ product.category }}</span>
              </div>
              
              <div v-if="product.sku" class="flex justify-between">
                <span class="text-gray-600">SKU:</span>
                <span class="font-mono text-sm text-gray-900">{{ product.sku }}</span>
              </div>
              
              <div v-if="product.weight" class="flex justify-between">
                <span class="text-gray-600">Weight:</span>
                <span class="font-medium text-gray-900">{{ product.weight }}g</span>
              </div>
              
              <div v-if="product.dimensions" class="flex justify-between">
                <span class="text-gray-600">Dimensions:</span>
                <span class="font-medium text-gray-900">
                  {{ product.dimensions.width }} × {{ product.dimensions.height }} × {{ product.dimensions.depth }} cm
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3">
              <button
                @click="handleDelete"
                :disabled="deleting"
                class="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="!deleting" class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span v-if="deleting">Deleting...</span>
                <span v-else>Delete Product</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProductStore } from "../stores/product";

export default {
  name: "ViewProduct",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const productStore = useProductStore();
    
    const product = ref({});
    const loading = ref(false);
    const error = ref(null);
    const deleting = ref(false);
    const currentImage = ref('');

    const fetchProduct = async () => {
      loading.value = true;
      error.value = null;
      try {
        const data = await productStore.fetchProductById(route.params.id);
        if (data) {
          product.value = data;
          currentImage.value = data.thumbnail || data.images?.[0] || 'https://via.placeholder.com/600';
        } else {
          error.value = "Product not found";
        }
      } catch (err) {
        error.value = "Failed to load product";
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    const handleDelete = async () => {
      if (!confirm('Are you sure you want to delete this product?')) {
        return;
      }
      
      deleting.value = true;
      const success = await productStore.deleteProduct(product.value.id);
      deleting.value = false;
      
      if (success) {
        router.push('/products');
      } else {
        alert('Failed to delete product');
      }
    };

    const goBack = () => router.push("/products");

    onMounted(fetchProduct);

    return { 
      product, 
      loading, 
      error, 
      deleting,
      currentImage,
      handleDelete,
      goBack 
    };
  },
};
</script>
