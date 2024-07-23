<template>
  <main class="py-14">
    <div class="max-w-screen-xl mx-auto px-4 text-gray-600 md:px-8">
      <div class="max-w-xl space-y-3">
        <h3 class="text-indigo-600 font-semibold">
          {{ $t('app.contact.heading') }}
        </h3>
        <p class="text-gray-800 text-3xl font-semibold sm:text-4xl">
          {{ $t('app.contact.title') }}
        </p>
        <p>
          {{ $t('app.contact.description') }}
        </p>
      </div>
      <div>
        <ul class="mt-12 flex flex-wrap gap-x-12 gap-y-6 items-center lg:gap-x-24">
          <li>
            <h4 class="text-gray-800 text-lg font-medium">{{ $t('app.contact.office') }}</h4>
            <div class="mt-3 flex items-center gap-x-3">
              <p>242 Rue du Faubourg Saint-Antoine, 75012 Paris</p>
            </div>
          </li>
          <li>
            <h4 class="text-gray-800 text-lg font-medium">{{ $t('app.contact.phone') }}</h4>
            <div class="mt-3 flex items-center gap-x-3">
              <p>+33 1 56 06 90 41</p>
            </div>
          </li>
          <li>
            <h4 class="text-gray-800 text-lg font-medium">{{ $t('app.contact.email') }}</h4>
            <div class="mt-3 flex items-center gap-x-3">
              <p>support@assili.com</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
</script>