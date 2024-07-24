
// @ts-nocheck

import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import UserForm from '@/components/UserForm.vue'

describe('UserForm', () => {
  const mockFormData = {
    email: '',
    password: '',
    role: '',
    isConfirmed: false
  }
  const mockErrors = {}
  const mockUpdateField = vi.fn()

  const createWrapper = (props = {}) => {
    return mount(UserForm, {
      props: {
        formData: mockFormData,
        errors: mockErrors,
        updateField: mockUpdateField,
        ...props
      }
    })
  }

  it('renders all form fields', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    expect(wrapper.find('select').exists()).toBe(true)
    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
  })

  it('emits update-field event when email input changes', async () => {
    const wrapper = createWrapper()
    const emailInput = wrapper.find('input[type="email"]')
    await emailInput.setValue('test@example.com')
    expect(wrapper.emitted('update-field')).toBeTruthy()
    expect(wrapper.emitted('update-field')?.[0]).toEqual(['email', 'test@example.com'])
  })

  it('emits update-field event when password input changes', async () => {
    const wrapper = createWrapper()
    const passwordInput = wrapper.find('input[type="password"]')
    await passwordInput.setValue('password123')
    expect(wrapper.emitted('update-field')).toBeTruthy()
    expect(wrapper.emitted('update-field')?.[0]).toEqual(['password', 'password123'])
  })

  it('emits update-field event when role select changes', async () => {
    const wrapper = createWrapper()
    const roleSelect = wrapper.find('select')
    await roleSelect.setValue('ROLE_ADMIN')
    expect(wrapper.emitted('update-field')).toBeTruthy()
    expect(wrapper.emitted('update-field')?.[0]).toEqual(['role', 'ROLE_ADMIN'])
  })

  it('calls updateField when isConfirmed checkbox changes', async () => {
    const wrapper = createWrapper()
    const isConfirmedCheckbox = wrapper.find('input[type="checkbox"]')
    await isConfirmedCheckbox.setChecked(true)
    expect(mockUpdateField).toHaveBeenCalledWith('isConfirmed', true)
  })

  it('displays error messages when provided', () => {
    const errors = {
      email: 'Invalid email',
      password: 'Password too short',
      role: 'Role is required'
    }
    const wrapper = createWrapper({ errors })
    expect(wrapper.find('p.text-red-500').text()).toBe('Invalid email')
    expect(wrapper.findAll('p.text-red-500').length).toBe(3)
  })

  it('renders the correct options for role select', () => {
    const wrapper = createWrapper()
    const options = wrapper.findAll('select option')
    expect(options.length).toBe(3) // Including the default option
    expect(options[1].text()).toBe('Utilisateur')
    expect(options[2].text()).toBe('Administrateur')
  })

  it('binds form data correctly', () => {
    const formData = {
      email: 'test@example.com',
      password: 'password123',
      role: 'ROLE_USER',
      isConfirmed: true
    }
    const wrapper = createWrapper({ formData })
    expect(wrapper.find('input[type="email"]').element.value).toBe('test@example.com')
    expect(wrapper.find('input[type="password"]').element.value).toBe('password123')
    expect(wrapper.find('select').element.value).toBe('ROLE_USER')
    expect(wrapper.find('input[type="checkbox"]').element.checked).toBe(true)
  })
})
