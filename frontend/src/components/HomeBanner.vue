<template>
  <section class="py-14" style="background: linear-gradient(152.92deg, rgba(192, 132, 252, 0.2) 4.54%, rgba(232, 121, 249, 0.17) 34.2%, rgba(192, 132, 252, 0.1) 77.55%);">
    <div class="max-w-screen-xl mx-auto px-4 md:text-center md:px-8">
      <div class="max-w-xl space-y-3 md:mx-auto">
        <p class="text-gray-800 text-3xl font-semibold sm:text-4xl">
          {{ $t('app.banner.title') }}
        </p>
        <p class="text-gray-600">
          {{ $t('app.banner.description') }}
        </p>
      </div>
      <div class="mt-4">
        <a href="javascript:void(0)" class="inline-block py-2 px-4 text-white font-medium bg-gray-800 duration-150 hover:bg-gray-700 active:bg-gray-900 rounded-lg shadow-md hover:shadow-none">
          {{ $t('app.banner.button') }}
        </a>
      </div>
    </div>
  </section>
</template>
