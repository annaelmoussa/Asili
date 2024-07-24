import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import DeleteButton from '@/components/DeleteButton.vue'

describe('DeleteButton', () => {
  const createWrapper = (props = {}) => {
    return mount(DeleteButton, {
      props: {
        onDelete: vi.fn(),
        ...props
      },
      global: {
        stubs: ['Trash']
      }
    })
  }

  it('renders the button text when not using icon', () => {
    const wrapper = createWrapper({ buttonText: 'Delete Item' })
    expect(wrapper.find('.button-text').text()).toBe('Delete Item')
  })

  it('renders the Trash icon when using icon', () => {
    const wrapper = createWrapper({ useIcon: true })
    expect(wrapper.findComponent({ name: 'Trash' }).exists()).toBe(true)
  })

  it('shows modal when delete button is clicked', async () => {
    const wrapper = createWrapper()
    await wrapper.find('.delete-button').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isModalVisible).toBe(true)
  })
})
