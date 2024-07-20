import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import ProductForm from '../ProductForm.vue'

describe('ProductForm', () => {
  const mockCategories = [
    { id: '1', name: 'Category 1' },
    { id: '2', name: 'Category 2' }
  ]
  const mockBrands = [
    { id: '1', name: 'Brand 1' },
    { id: '2', name: 'Brand 2' }
  ]
  const mockFormData = {
    name: '',
    description: '',
    price: '',
    categoryId: '',
    brandId: '',
    stock: 0,
    image: null,
    isPromotion: false,
    lowStockThreshold: 0
  }
  const mockErrors = {}

  const createWrapper = () => {
    return mount(ProductForm, {
      props: {
        formData: mockFormData,
        errors: mockErrors,
        categories: mockCategories,
        brands: mockBrands
      },
      global: {
        stubs: ['router-link', 'router-view']
      }
    })
  }

  it('renders all form fields', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('input[id="name"]').exists()).toBe(true)
    expect(wrapper.find('textarea[id="description"]').exists()).toBe(true)
    expect(wrapper.find('input[id="price"]').exists()).toBe(true)
    expect(wrapper.find('select[id="categoryId"]').exists()).toBe(true)
    expect(wrapper.find('select[id="brandId"]').exists()).toBe(true)
    expect(wrapper.find('input[id="stock"]').exists()).toBe(true)
    expect(wrapper.find('input[id="image"]').exists()).toBe(true)
    expect(wrapper.find('input[id="isPromotion"]').exists()).toBe(true)
    expect(wrapper.find('input[id="lowStockThreshold"]').exists()).toBe(true)
  })

  it('emits update-field event when text input changes', async () => {
    const wrapper = createWrapper()
    const nameInput = wrapper.find('input[id="name"]')
    await nameInput.setValue('New Product')
    expect(wrapper.emitted('update-field')).toBeTruthy()
    expect(wrapper.emitted('update-field')?.[0]).toEqual(['name', 'New Product'])
  })

  it('emits update-field event when select changes', async () => {
    const wrapper = createWrapper()
    const categorySelect = wrapper.find('select[id="categoryId"]')
    await categorySelect.setValue('1')
    expect(wrapper.emitted('update-field')).toBeTruthy()
    expect(wrapper.emitted('update-field')?.[0]).toEqual(['categoryId', '1'])
  })

  it('emits update-field event when checkbox changes', async () => {
    const wrapper = createWrapper()
    const promotionCheckbox = wrapper.find('input[id="isPromotion"]')
    await promotionCheckbox.setValue(true)
    expect(wrapper.emitted('update-field')).toBeTruthy()
    expect(wrapper.emitted('update-field')?.[0]).toEqual(['isPromotion', true])
  })

  it('handles file upload', async () => {
    const wrapper = createWrapper()
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' })

    // Simuler l'événement de changement de fichier
    await wrapper.vm.handleFileUpload({ target: { files: [file] } } as any, 'image')

    expect(wrapper.emitted('update-field')).toBeTruthy()
    const emittedEvents = wrapper.emitted('update-field') as any[][]
    expect(emittedEvents[0][0]).toEqual('image')
    expect(emittedEvents[0][1]).toBeInstanceOf(File)
    expect(emittedEvents[0][1].name).toBe('test.jpg')
  })

  it('displays error messages', () => {
    const wrapper = mount(ProductForm, {
      props: {
        formData: mockFormData,
        errors: { name: 'Name is required' },
        categories: mockCategories,
        brands: mockBrands
      },
      global: {
        stubs: ['router-link', 'router-view']
      }
    })
    expect(wrapper.find('.text-red-500').text()).toBe('Name is required')
  })
})
