<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-primary">Add New Product</h1>
          <button
            @click="goBack"
            class="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-2xl shadow-lg p-8">
        <!-- Success Message -->
        <div v-if="successMessage" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <p class="text-green-700 font-medium">{{ successMessage }}</p>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-600">{{ errorMessage }}</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Title -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
              Product Title <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.title"
              id="title"
              type="text"
              placeholder="Enter product title"
              class="input-field"
              required
            />
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
              Description <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="formData.description"
              id="description"
              rows="4"
              placeholder="Enter product description"
              class="input-field resize-none"
              required
            ></textarea>
          </div>

          <!-- Price and Stock -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label for="price" class="block text-sm font-medium text-gray-700 mb-2">
                Price ($) <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="formData.price"
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                class="input-field"
                required
              />
            </div>

            <div>
              <label for="stock" class="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="formData.stock"
                id="stock"
                type="number"
                min="0"
                placeholder="0"
                class="input-field"
                required
              />
            </div>
          </div>

          <!-- Category and Brand -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                v-model="formData.category"
                id="category"
                type="text"
                placeholder="e.g., Electronics"
                class="input-field"
              />
            </div>

            <div>
              <label for="brand" class="block text-sm font-medium text-gray-700 mb-2">
                Brand
              </label>
              <input
                v-model="formData.brand"
                id="brand"
                type="text"
                placeholder="e.g., Apple"
                class="input-field"
              />
            </div>
          </div>

          <!-- Discount Percentage -->
          <div>
            <label for="discountPercentage" class="block text-sm font-medium text-gray-700 mb-2">
              Discount Percentage (%)
            </label>
            <input
              v-model.number="formData.discountPercentage"
              id="discountPercentage"
              type="number"
              step="0.01"
              min="0"
              max="100"
              placeholder="0"
              class="input-field"
            />
          </div>

          <!-- Thumbnail URL -->
          <div>
            <label for="thumbnail" class="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail Image URL
            </label>
            <input
              v-model="formData.thumbnail"
              id="thumbnail"
              type="url"
              placeholder="https://example.com/image.jpg"
              class="input-field"
            />
            <p class="mt-1 text-sm text-gray-500">Optional: Enter a URL for the product image</p>
          </div>

          <!-- Submit Button -->
          <div class="flex gap-3 pt-4">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="btn-primary flex-1"
            >
              <span v-if="isSubmitting" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding Product...
              </span>
              <span v-else>
                <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Product
              </span>
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useProductStore } from "../stores/product";

export default {
  name: "AddProduct",
  setup() {
    const router = useRouter();
    const productStore = useProductStore();
    
    const formData = ref({
      title: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
      brand: "",
      discountPercentage: 0,
      thumbnail: ""
    });
    
    const isSubmitting = ref(false);
    const successMessage = ref("");
    const errorMessage = ref("");

    const handleSubmit = async () => {
      isSubmitting.value = true;
      successMessage.value = "";
      errorMessage.value = "";

      try {
        const result = await productStore.addProduct(formData.value);
        
        if (result) {
          successMessage.value = `Product "${result.title}" added successfully!`;
          
          // Reset form
          formData.value = {
            title: "",
            description: "",
            price: 0,
            stock: 0,
            category: "",
            brand: "",
            discountPercentage: 0,
            thumbnail: ""
          };

          // Redirect after 2 seconds
          setTimeout(() => {
            router.push('/products');
          }, 2000);
        } else {
          errorMessage.value = "Failed to add product. Please try again.";
        }
      } catch (err) {
        console.error(err);
        errorMessage.value = "An error occurred. Please try again.";
      } finally {
        isSubmitting.value = false;
      }
    };

    const goBack = () => {
      router.push('/products');
    };

    return { 
      formData, 
      isSubmitting, 
      successMessage, 
      errorMessage,
      handleSubmit,
      goBack
    };
  },
};
</script>
