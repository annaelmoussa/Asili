// @ts-nocheck

import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import Cart from '@/components/Cart.vue'
import { createPinia, setActivePinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

describe('Cart', () => {
  const mockCartItems = [
    {
      id: '1',
      product: {
        id: '1',
        name: 'Product 1',
        price: 10,
        image: 'product1.jpg',
        category: { name: 'Category 1' },
        description: 'Description 1'
      },
      quantity: 2
    },
    {
      id: '2',
      product: {
        id: '2',
        name: 'Product 2',
        price: 20,
        image: 'product2.jpg',
        category: { name: 'Category 2' },
        description: 'Description 2'
      },
      quantity: 1
    }
  ]

  const createWrapper = () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const i18n = createI18n({
      legacy: false,
      locale: 'en',
      messages: {
        en: {
          'app.cart.title': 'Shopping Cart',
          'app.cart.cartEmpty': 'Your cart is empty',
          'app.payment.orderSummary': 'Order Summary',
          'app.payment.totalItems': 'Total Items',
          'app.payment.totalAmount': 'Total Amount',
          'app.payment.proceedToPayment': 'Proceed to Payment',
          'app.cart.quantityIncreased': 'Quantity increased',
          'app.cart.quantityDecreased': 'Quantity decreased',
          'app.cart.productRemoved': 'Product removed from cart'
        }
      }
    })

    const router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/', component: {} }]
    })

    return mount(Cart, {
      global: {
        plugins: [pinia, i18n, router],
        stubs: ['router-link', 'router-view']
      }
    })
  }

  it('renders the cart title', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.cart-title').text()).toBe('Shopping Cart')
  })

  it('displays empty cart message when cart is empty', async () => {
    const wrapper = createWrapper()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.cart-empty').exists()).toBe(true)
    expect(wrapper.find('.cart-empty').text()).toBe('Your cart is empty')
  })

  it('renders cart items when cart is not empty', async () => {
    const wrapper = createWrapper()
    await wrapper.vm.$nextTick()

    wrapper.vm.cart.items = mockCartItems
    await wrapper.vm.$nextTick()

    const cartItems = wrapper.findAll('.cart-item')
    expect(cartItems.length).toBe(2)
    expect(cartItems[0].find('.cart-item-title').text()).toBe('Product 1')
    expect(cartItems[1].find('.cart-item-title').text()).toBe('Product 2')
  })

  it('calculates and displays the correct total price', async () => {
    const wrapper = createWrapper()
    await wrapper.vm.$nextTick()

    wrapper.vm.cart.items = mockCartItems
    await wrapper.vm.$nextTick()

    const totalPrice = wrapper.find('.summary-row.total span:last-child')
    expect(totalPrice.text()).toContain('40') // (10 * 2) + (20 * 1) = 40
  })

  it('increments item quantity when plus button is clicked', async () => {
    const wrapper = createWrapper()
    await wrapper.vm.$nextTick()

    wrapper.vm.cart.items = mockCartItems
    await wrapper.vm.$nextTick()

    const incrementButton = wrapper.find('.quantity-btn:last-child')
    await incrementButton.trigger('click')

    expect(wrapper.vm.cart.items[0].quantity).toBe(3)
  })

  it('decrements item quantity when minus button is clicked', async () => {
    const wrapper = createWrapper()
    await wrapper.vm.$nextTick()

    wrapper.vm.cart.items = [{ ...mockCartItems[0], quantity: 2 }]
    await wrapper.vm.$nextTick()

    const decrementButton = wrapper.find('.quantity-btn:first-child')
    await decrementButton.trigger('click')

    expect(wrapper.vm.cart.items[0].quantity).toBe(1)
  })

  it('removes item from cart when remove button is clicked', async () => {
    const wrapper = createWrapper()
    await wrapper.vm.$nextTick()

    wrapper.vm.cart.items = mockCartItems
    await wrapper.vm.$nextTick()

    const removeButton = wrapper.find('.remove-btn')
    await removeButton.trigger('click')

    expect(wrapper.vm.cart.items.length).toBe(1)
    expect(wrapper.vm.cart.items[0].id).toBe('2')
  })
})
