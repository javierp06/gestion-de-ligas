<template>
  <div class="space-y-3">
    <label v-if="label" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
      {{ label }}
    </label>
    
    <div class="flex items-start gap-4">
      <!-- Preview Area -->
      <div 
        class="relative flex-shrink-0 bg-gray-100 dark:bg-gray-700 overflow-hidden border border-gray-200 dark:border-gray-600 group"
        :class="[circle ? 'rounded-full w-24 h-24' : 'rounded-lg w-32 h-24']"
      >
        <img 
          v-if="imageUrl" 
          :src="imageUrl" 
          class="w-full h-full object-cover" 
          alt="Preview" 
        />
        <div 
          v-else 
          class="w-full h-full flex items-center justify-center text-gray-400"
        >
          <span class="material-symbols-outlined text-3xl">image</span>
        </div>

        <!-- Overlay Loading -->
        <div v-if="uploading" class="absolute inset-0 bg-black/50 flex items-center justify-center">
          <span class="material-symbols-outlined animate-spin text-white">progress_activity</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex-1 space-y-2">
        <div class="flex items-center gap-2">
          <label class="btn-secondary px-4 py-2 rounded-lg text-sm font-bold cursor-pointer flex items-center gap-2 max-w-fit">
            <span class="material-symbols-outlined text-lg">upload</span>
            <span>{{ uploading ? 'Subiendo...' : 'Subir Imagen' }}</span>
            <input 
              type="file" 
              accept="image/png, image/jpeg, image/jpg, image/webp" 
              class="hidden" 
              @change="handleFileChange"
              :disabled="uploading"
            />
          </label>
          
          <button 
            v-if="imageUrl" 
            type="button"
            @click="removeImage"
            class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Eliminar imagen"
          >
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
        
        <p class="text-xs text-gray-500 dark:text-gray-400">
          JPG, PNG o WEBP. Máx 5MB.
        </p>
        <p v-if="error" class="text-xs text-red-500 font-medium">
          {{ error }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  modelValue?: string | null
  label?: string
  circle?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
  'file-selected': [file: File]
}>()

const { $api } = useNuxtApp()
const uploading = ref(false)
const error = ref('')
const pendingFile = ref<File | null>(null)
const localPreview = ref<string | null>(null)

// Initialize with prop value
const imageUrl = computed(() => localPreview.value || props.modelValue)

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  
  // Basic validation
  if (file.size > 5 * 1024 * 1024) {
    error.value = 'El archivo es demasiado grande (Máx 5MB)'
    return
  }
  
  error.value = ''
  pendingFile.value = file
  
  // Create local preview
  if (localPreview.value) URL.revokeObjectURL(localPreview.value)
  localPreview.value = URL.createObjectURL(file)
  
  // Notify parent that a file is ready to be uploaded (optional, for validation msg)
  emit('file-selected', file)
  
  // Reset input so same file can be selected again
  input.value = '' 
}

const removeImage = () => {
  pendingFile.value = null
  if (localPreview.value) {
    URL.revokeObjectURL(localPreview.value)
    localPreview.value = null
  }
  emit('update:modelValue', null)
}

// Parent calls this method when saving the form
const upload = async (): Promise<string | null> => {
  if (!pendingFile.value) return props.modelValue || null

  uploading.value = true
  error.value = ''

  const formData = new FormData()
  formData.append('file', pendingFile.value)

  try {
    const { data } = await $api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (data.success) {
      // Clear local state after success
      pendingFile.value = null 
      if (localPreview.value) {
         URL.revokeObjectURL(localPreview.value)
         localPreview.value = null
      }
      
      emit('update:modelValue', data.data.url)
      return data.data.url
    }
    return null
  } catch (err: any) {
    console.error(err)
    error.value = err.response?.data?.message || 'Error al subir la imagen'
    throw err // Re-throw so parent knows save failed
  } finally {
    uploading.value = false
  }
}

// Expose the upload method to the parent
defineExpose({
  upload
})
</script>
