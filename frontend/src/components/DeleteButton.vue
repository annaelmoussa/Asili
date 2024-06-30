<template>
  <div>
    <button @click="showModal" :disabled="isLoading" class="delete-button">
      {{ buttonText }}
    </button>

    <teleport to="body">
      <div v-if="isModalVisible" class="modal-overlay" @click="hideModal">
        <div class="modal-content" @click.stop>
          <h2>Confirmation de suppression</h2>
          <p>{{ confirmationMessage }}</p>
          <div v-if="isLoading" class="loader">Chargement...</div>
          <div v-else-if="error" class="error-message">
            {{ error }}
          </div>
          <div v-else class="modal-actions">
            <button @click="confirmDelete" class="confirm-button">Confirmer</button>
            <button @click="hideModal" class="cancel-button">Annuler</button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, type PropType } from 'vue'

type DeleteFunction = () => Promise<void>

export default defineComponent({
  name: 'DeleteButton',
  props: {
    buttonText: {
      type: String,
      default: 'Supprimer'
    },
    confirmationMessage: {
      type: String,
      default: 'Êtes-vous sûr de vouloir supprimer cet élément ?'
    },
    onDelete: {
      type: Function as PropType<DeleteFunction>,
      required: true
    },
    onSuccess: {
      type: Function as PropType<() => void>,
      default: () => {}
    }
  },
  setup(props) {
    const isModalVisible = ref(false)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const showModal = () => {
      isModalVisible.value = true
      error.value = null
    }

    const hideModal = () => {
      isModalVisible.value = false
      error.value = null
    }

    const confirmDelete = async () => {
      isLoading.value = true
      error.value = null

      try {
        await props.onDelete()
        hideModal()
        props.onSuccess()
      } catch (e) {
        error.value = e instanceof Error ? e.message : 'Une erreur est survenue'
      } finally {
        isLoading.value = false
      }
    }

    return {
      isModalVisible,
      isLoading,
      error,
      showModal,
      hideModal,
      confirmDelete
    }
  }
})
</script>

<style scoped>
.delete-button {
  /* Styles pour le bouton de suppression */
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  max-width: 400px;
  width: 100%;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.confirm-button,
.cancel-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.confirm-button {
  background-color: #dc3545;
  color: white;
}

.cancel-button {
  background-color: #6c757d;
  color: white;
}

.loader {
  text-align: center;
  margin: 20px 0;
}

.error-message {
  color: #dc3545;
  margin: 20px 0;
}
</style>
