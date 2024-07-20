<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import Toaster from '@/components/ui/toast/Toaster.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { defaultApi } from '@/api/config'

const { toast } = useToast()

const preferences = ref({
  newProductInCategory: false,
  productRestock: false,
  priceChange: false,
  newsletter: false,
})

onMounted(async () => {
  try {
    const response = await defaultApi.getAlertPreferences()
    preferences.value = response.data
    console.log('Preferences:', preferences.value)
  } catch (error) {
    console.error('Failed to fetch preferences:', error)
    toast({
      title: "Error",
      description: "Failed to load preferences. Please try again.",
      variant: "destructive",
    })
  }
})

const savePreferences = async () => {
  try {
    const preferencesToSend = {
      newProductInCategory: preferences.value.newProductInCategory,
      productRestock: preferences.value.productRestock,
      priceChange: preferences.value.priceChange,
      newsletter: preferences.value.newsletter
    };
    console.log('Sending preferences:', JSON.stringify(preferencesToSend));
    await defaultApi.updateAlertPreferences(preferencesToSend);
    toast({
      title: "Success",
      description: "Your preferences have been updated.",
    });
  } catch (error) {
    console.error('Failed to save preferences:', error);
    toast({
      title: "Error",
      description: "Failed to save preferences. Please try again.",
      variant: "destructive",
    });
  }
};
</script>

<template>
  <div>
    <h3 class="text-lg font-medium">
      Notifications
    </h3>
    <p class="text-sm text-muted-foreground">
      Configure how you receive notifications.
    </p>
  </div>
  <Separator class="my-4" />
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <Label for="new-product" class="flex flex-col space-y-1">
        <span>New Product Alerts</span>
        <span class="text-sm text-muted-foreground">Receive notifications when new products are added to categories you're interested in.</span>
      </Label>
      <Switch id="new-product" v-model:checked="preferences.newProductInCategory" />
    </div>
    <div class="flex items-center justify-between">
      <Label for="restock" class="flex flex-col space-y-1">
        <span>Restock Alerts</span>
        <span class="text-sm text-muted-foreground">Get notified when products you're interested in are back in stock.</span>
      </Label>
      <Switch id="restock" v-model:checked="preferences.productRestock" />
    </div>
    <div class="flex items-center justify-between">
      <Label for="price-change" class="flex flex-col space-y-1">
        <span>Price Change Alerts</span>
        <span class="text-sm text-muted-foreground">Receive notifications when prices change on products you're watching.</span>
      </Label>
      <Switch id="price-change" v-model:checked="preferences.priceChange" />
    </div>
    <div class="flex items-center justify-between">
      <Label for="newsletter" class="flex flex-col space-y-1">
        <span>Newsletter Subscription</span>
        <span class="text-sm text-muted-foreground">Subscribe to our newsletter for the latest updates and offers.</span>
      </Label>
      <Switch id="newsletter" v-model:checked="preferences.newsletter" />
    </div>
  </div>
  <div class="mt-6">
    <Button @click="savePreferences">Save Preferences</Button>
  </div>
  <Toaster />
</template>

<style scoped>
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.space-y-1 > * + * {
  margin-top: 0.25rem;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}
</style>
