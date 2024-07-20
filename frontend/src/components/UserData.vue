<script setup lang="ts">
import { h, ref } from 'vue'

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
import Toaster from '@/components/ui/toast'

const verifiedEmails = ref(['m@example.com', 'm@google.com', 'm@support.com'])


</script>

<template>
  <div>
    <h3 class="text-lg font-medium">
      Mes donnéesssss
    </h3>
    <p class="text-sm text-muted-foreground">
      This is how others will see you on the site.
    </p>
  </div>
  <Separator />
</template>