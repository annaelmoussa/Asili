<template>
    <section class="py-14" style="background: linear-gradient(152.92deg, rgba(192, 132, 252, 0.2) 4.54%, rgba(232, 121, 249, 0.17) 34.2%, rgba(192, 132, 252, 0.1) 77.55%);">
      <div class="max-w-screen-xl mx-auto px-4 md:text-center md:px-8">
        <div class="max-w-xl space-y-3 md:mx-auto">
          <p class="text-gray-800 text-3xl font-semibold sm:text-4xl">
            {{ $t('app.banner.NewsletterTitle') }}
          </p>
          <p class="text-gray-600">
            {{ $t('app.banner.descriptionNewsletter') }}
          </p>
        </div>
        <div class="mt-4">
          <div v-if="isLoggedIn">
            <Button @click="toggleNewsletterSubscription">
              {{ isSubscribed ? $t('app.banner.unsubscribe') : $t('app.banner.subscribe') }}
            </Button>
          </div>
          <div v-else class="flex flex-col items-center space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 justify-center">
            <Input v-model="email" type="email" placeholder="Enter your email" class="max-w-xs w-full" />
            <Button @click="subscribeToNewsletter">Subscribe to Newsletter</Button>
          </div>
        </div>
      </div>
    </section>
  </template>
  <script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { defaultApi } from '@/api/config'
import { useUserStore } from '@/stores/user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const userStore = useUserStore()

const isLoggedIn = computed(() => userStore.isAuthenticated)
const isSubscribed = ref(false)
const email = ref('')
const isLoading = ref(false)
const message = ref('')
const isError = ref(false)

onMounted(async () => {
  if (isLoggedIn.value) {
    await checkSubscriptionStatus()
  }
})

async function checkSubscriptionStatus() {
  try {
    const response = await defaultApi.getNewsletterSubscriptionStatus()
    isSubscribed.value = response.data.isSubscribed
  } catch (error) {
    console.error('Failed to get subscription status:', error)
  }
}

async function toggleNewsletterSubscription() {
  if (isLoading.value) return

  isLoading.value = true
  message.value = ''
  isError.value = false

  try {
    if (isSubscribed.value) {
      await defaultApi.unsubscribeFromNewsletter()
      isSubscribed.value = false
      message.value = 'Successfully unsubscribed from the newsletter.'
    } else {
      await defaultApi.subscribeToNewsletter()
      isSubscribed.value = true
      message.value = 'Successfully subscribed to the newsletter.'
    }

    await checkSubscriptionStatus()
  } catch (error) {
    console.error('Failed to toggle newsletter subscription:', error)
    message.value = 'Failed to update newsletter subscription. Please try again.'
    isError.value = true
  } finally {
    isLoading.value = false
  }
}

async function subscribeToNewsletter() {
  if (isLoading.value) return

  isLoading.value = true
  message.value = ''
  isError.value = false

  try {
    if (!email.value) {
      throw new Error('Please enter an email address')
    }
    await defaultApi.subscribeGuestToNewsletter({ email: email.value })
    message.value = 'Successfully subscribed to the newsletter.'
    email.value = ''
  } catch (error) {
    console.error('Failed to subscribe to newsletter:', error)
    message.value = 'Failed to subscribe. Please try again.'
    isError.value = true
  } finally {
    isLoading.value = false
  }
}
</script>