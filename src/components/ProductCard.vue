<template>
  <div class="card p-4 cursor-pointer" @click="$emit('click', product)">
    <div class="aspect-square mb-3 overflow-hidden rounded-lg bg-gray-100">
      <img 
        :src="product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/300'" 
        :alt="product.title"
        class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />
    </div>
    
    <h3 class="font-semibold text-gray-900 mb-1 line-clamp-2">{{ product.title }}</h3>
    
    <div class="flex items-center justify-between mb-2">
      <span class="text-lg font-bold text-primary">${{ product.price }}</span>
      <div class="flex items-center text-sm text-gray-600">
        <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span>{{ product.rating || 'N/A' }}</span>
      </div>
    </div>
    
    <p class="text-sm text-gray-500 line-clamp-2">{{ product.description }}</p>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  emits: ['click']
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
