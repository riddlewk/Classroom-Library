import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Auth from '../../../components/Auth'

vi.mock('../../../lib/supabaseClient', () => {
  return {
    supabase: {
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({ data: { user: { email: 'demo1@example.com' } }, error: null }),
        signInWithOtp: vi.fn().mockResolvedValue({ error: null }),
        resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null }),
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
        onAuthStateChange: vi.fn().mockReturnValue({ data: null }),
      },
    },
  }
})

describe('Auth component', () => {
  it('calls signInWithPassword when usePassword is checked and credentials provided', async () => {
    const { supabase } = require('../../../lib/supabaseClient')
    render(<Auth />)

    const emailInput = screen.getByPlaceholderText('you@school.edu')
    const passwordInput = screen.getByPlaceholderText('Optional password')
    const usePasswordCheckbox = screen.getByRole('checkbox')
    const signInButton = screen.getByText('Sign in')

    fireEvent.change(emailInput, { target: { value: 'demo1@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'Password123' } })
    fireEvent.click(usePasswordCheckbox)
    fireEvent.click(signInButton)

    // allow async
    await new Promise((r) => setTimeout(r, 50))

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({ email: 'demo1@example.com', password: 'Password123' })
  })
})
