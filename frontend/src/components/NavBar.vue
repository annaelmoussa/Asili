<template>
  <div class="" style="height: 600px">
    <section class="bg-primary text-primary font-medium py-2 text-center text-xs sm:text-base">
      <strong>15%</strong> off on your first order.
    </section>
    <div
      class="surface-overlay px-3 sm:px-6 flex flex-wrap align-items-stretch justify-content-between relative lg:border-bottom-1 surface-border"
    >
      <a
        class="cursor-pointer flex align-items-center lg:hidden text-700 mr-3 p-ripple"
        @click="toggleNav"
      >
        <i class="pi pi-bars text-4xl"></i>
      </a>
      <div
        :class="{ hidden: !isNavVisible, flex: isNavVisible }"
        id="nav-2"
        class="surface-overlay absolute lg:static left-0 top-100 z-1 shadow-2 lg:shadow-none w-full lg:w-auto py-3 lg:py-0"
      >
        <ul class="list-none p-0 m-0 flex flex-column lg:flex-row">
          <li class="flex flex-column lg:flex-row">
            <a
              class="font-medium inline-flex align-items-center cursor-pointer border-left-2 lg:border-left-none lg:border-bottom-2 border-transparent hover:border-primary py-3 lg:py-0 px-6 lg:px-3 text-700 select-none text-xl lg:text-base lg:font-base w-full lg:w-auto p-ripple"
              @click="toggleSubMenu('women')"
            >
              <span>Women</span>
            </a>
            <div
              v-if="subMenuVisible === 'women'"
              class="surface-overlay shadow-none lg:shadow-2 lg:absolute w-full left-0 top-100 pl-8 pr-6 lg:px-6 py-0 lg:py-6"
            >
              <div class="grid flex-wrap">
                <div class="col-12 md:col-6 xl:col-3">
                  <a
                    class="font-medium text-lg cursor-pointer text-700 block lg:hidden mb-3 select-none"
                    >Clothing</a
                  >
                  <ul class="list-none py-0 pr-0 lg:pl-0 pl-5 m-0 text-700 hidden lg:block">
                    <li class="hidden lg:block">
                      <!-- <img
                        src="/images/blocks/ecommerce/storenavigation/storenavigation-2-1.png"
                        alt="Image"
                        height="160"
                        style="border-radius: 12px"
                      /> -->
                    </li>
                    <li class="font-bold my-5 text-xl text-900 hidden lg:block">Clothing</li>
                    <li class="mb-3 cursor-pointer hover:text-900">Dresses</li>
                    <li class="mb-3 cursor-pointer hover:text-900">Jeans</li>
                    <li class="mb-3 cursor-pointer hover:text-900">Pants</li>
                    <li class="mb-3 cursor-pointer hover:text-900">Skirts</li>
                    <li class="mb-3 cursor-pointer hover:text-900">Sweaters</li>
                    <li class="mb-3 cursor-pointer hover:text-900">Blouses</li>
                  </ul>
                </div>
                <div class="col-12 md:col-6 xl:col-3">
                  <a
                    class="font-medium text-lg cursor-pointer text-700 block lg:hidden mb-3 select-none"
                    >Shoes</a
                  >
                  <ul class="list-none py-0 pr-0 lg:pl-0 pl-5 m-0 text-700 hidden lg:block">
                    <li class="hidden lg:block">
                      <!-- <img
                        src="/images/blocks/ecommerce/storenavigation/storenavigation-2-2.png"
                        alt="Image"
                        height="160"
                        style="border-radius: 12px"
                      /> -->
                    </li>
                    <li class="font-bold my-5 text-xl text-900 hidden lg:block">Shoes</li>
                    <li class="mb-3 cursor-pointer hover:text-900">Athletic</li>
                    <li class="mb-3 cursor-pointer hover:text-900">Boots</li>
                    <li class="mb-3 cursor-pointer hover:text-900">Sneakers</li>
                    <li class="mb-3 cursor-pointer hover:text-900">Flats</li>
                    <li class="mb-3 cursor-pointer hover:text-900">Outdoor</li>
                  </ul>
                </div>
                <div class="col-12 md:col-6 xl:col-3">
                  <a
                    class="font-medium text-lg cursor-pointer text-700 block lg:hidden mb-3 select-none"
                    >Accessories</a
                  >
                  <ul class="list-none py-0 pr-0 lg:pl-0 pl-5 m-0 text-700 hidden lg:block">
                    <li class="hidden lg:block">
                      <!-- <img
                        src="/images/blocks/ecommerce/storenavigation/storenavigation-2-3.png"
                        alt="Image"
                        height="160"
                        style="border-radius: 12px"
                      /> -->
                    </li>
                    <li class="font-bold my-5 text-xl text-900 hidden lg:block">Accessories</li>
                    <li class="mb-3 cursor-pointer hover:text-900">Handbags</li>
                    <li class="mb-3 cursor-pointer hover:text-900">Gloves</li>
                    <li class="mb-3 cursor-pointer hover:text-900">Belts</li>
                    <li class="mb-3 cursor-pointer hover:text-900">Hats</li>
                    <li class="mb-3 cursor-pointer hover:text-900">Earmuffs</li>
                  </ul>
                </div>
                <div class="col-12 md:col-6 xl:col-3">
                  <a
                    class="font-medium text-lg cursor-pointer text-700 block lg:hidden mb-3 select-none"
                    >Beauty</a
                  >
                  <ul class="list-none py-0 pr-0 lg:pl-0 pl-5 m-0 text-700 hidden lg:block">
                    <li class="hidden lg:block">
                      <!-- <img
                        src="/images/blocks/ecommerce/storenavigation/storenavigation-2-4.png"
                        alt="Image"
                        height="160"
                        style="border-radius: 12px"
                      /> -->
                    </li>
                    <li class="font-bold my-5 text-xl text-900 hidden lg:block">Beauty</li>
                    <li class="mb-3 cursor-pointer hover:text-900">Anklets</li>
                    <li class="mb-3 cursor-pointer hover:text-900">Bracelets</li>
                    <li class="mb-3 cursor-pointer hover:text-900">Earrings</li>
                    <li class="mb-3 cursor-pointer hover:text-900">Necklaces</li>
                    <li class="mb-3 cursor-pointer hover:text-900">Rings</li>
                    <li class="mb-3 cursor-pointer hover:text-900">Wedding</li>
                  </ul>
                </div>
              </div>
            </div>
          </li>
          <li class="flex flex-column lg:flex-row">
            <a
              class="font-medium inline-flex align-items-center cursor-pointer border-left-2 lg:border-left-none lg:border-bottom-2 border-transparent hover:border-primary py-3 lg:py-0 px-6 lg:px-3 text-700 select-none text-xl lg:text-base font-medium lg:font-base w-full lg:w-auto p-ripple"
              @click="toggleSubMenu('men')"
            >
              <span>Men</span>
            </a>
            <div
              v-if="subMenuVisible === 'men'"
              class="surface-overlay shadow-none lg:shadow-2 lg:absolute w-full left-0 top-100 px-6 py-0 lg:py-6 h-10rem lg:h-30rem"
            >
              <div class="border-2 border-dashed surface-border border-round h-full"></div>
            </div>
          </li>
          <li class="flex flex-column lg:flex-row">
            <a
              class="font-medium inline-flex align-items-center cursor-pointer border-left-2 lg:border-left-none lg:border-bottom-2 border-transparent hover:border-primary py-3 lg:py-0 px-6 lg:px-3 text-700 select-none text-xl lg:text-base font-medium lg:font-base w-full lg:w-auto p-ripple"
              @click="toggleSubMenu('kids')"
            >
              <span>Kids</span>
            </a>
            <div
              v-if="subMenuVisible === 'kids'"
              class="surface-overlay shadow-none lg:shadow-2 lg:absolute w-full left-0 top-100 px-6 py-0 lg:py-6 h-10rem lg:h-30rem"
            >
              <div class="border-2 border-dashed surface-border border-round h-full"></div>
            </div>
          </li>
        </ul>
      </div>
      <div class="flex align-items-center justify-content-center py-3">
        <!-- <img src="/images/blocks/logos/hyper-text-indigo.svg" alt="Image" height="40" /> -->
      </div>
      <div class="lg:flex w-full lg:w-auto hidden py-3 lg:py-0">
        <ul class="list-none p-0 m-0 flex w-full" style="min-height: 30px">
          <li class="flex flex-auto lg:flex-initial justify-content-center">
            <a
              class="text-900 font-medium inline-flex align-items-center cursor-pointer lg:px-3 hover:text-primary p-ripple"
            >
              <i class="pi pi-search text-xl"></i>
            </a>
          </li>
          <li class="flex flex-auto lg:flex-initial justify-content-center">
            <a
              class="text-900 font-medium inline-flex align-items-center cursor-pointer lg:px-3 hover:text-primary p-ripple"
            >
              <i class="pi pi-heart text-xl"></i>
            </a>
          </li>
          <li class="flex flex-auto lg:flex-initial justify-content-center">
            <a
              class="text-900 font-medium inline-flex align-items-center cursor-pointer lg:px-3 hover:text-primary p-ripple"
            >
              <i class="pi pi-user text-xl"></i>
            </a>
          </li>
          <li class="flex flex-auto lg:flex-initial justify-content-center">
            <a
              class="text-900 font-medium inline-flex align-items-center cursor-pointer lg:pl-3 pr-3 hover:text-primary p-ripple"
            >
              <i class="pi pi-shopping-cart text-xl p-overlay-badge">
                <span id="pv_id_34_badge" class="p-badge p-component p-badge-dot"></span>
              </i>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div
      class="flex w-full lg:w-auto border-y-1 surface-border surface-overlay lg:hidden py-3 lg:py-0"
    >
      <ul class="list-none p-0 m-0 flex w-full" style="min-height: 30px">
        <li class="flex flex-auto lg:flex-initial justify-content-center">
          <a
            class="text-900 font-medium inline-flex align-items-center cursor-pointer lg:pr-3 hover:text-primary p-ripple"
          >
            <i class="pi pi-search text-xl"></i>
          </a>
        </li>
        <li class="flex flex-auto lg:flex-initial justify-content-center">
          <a
            class="text-900 font-medium inline-flex align-items-center cursor-pointer lg:px-3 hover:text-primary p-ripple"
          >
            <i class="pi pi-heart text-xl"></i>
          </a>
        </li>
        <li class="flex flex-auto lg:flex-initial justify-content-center">
          <a
            class="text-900 font-medium inline-flex align-items-center cursor-pointer lg:px-3 hover:text-primary p-ripple"
          >
            <i class="pi pi-user text-xl"></i>
          </a>
        </li>
        <li class="flex flex-auto lg:flex-initial justify-content-center">
          <a
            class="text-900 font-medium inline-flex align-items-center cursor-pointer lg:pl-3 pr-1 hover:text-primary p-ripple"
          >
            <i class="pi pi-shopping-cart text-xl p-overlay-badge">
              <span id="pv_id_35_badge" class="p-badge p-component p-badge-dot"></span>
            </i>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'NavBar',
  setup() {
    const isNavVisible = ref(false)
    const subMenuVisible = ref<string | null>(null)

    const toggleNav = () => {
      isNavVisible.value = !isNavVisible.value
    }

    const toggleSubMenu = (menu: string) => {
      subMenuVisible.value = subMenuVisible.value === menu ? null : menu
    }

    return {
      isNavVisible,
      subMenuVisible,
      toggleNav,
      toggleSubMenu
    }
  }
})
</script>

<style scoped>
/* Add any additional custom styles here */
</style>
