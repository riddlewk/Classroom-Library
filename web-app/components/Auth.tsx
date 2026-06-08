"use client"

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [forgotMode, setForgotMode] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [user, setUser] = useState<any>(null)
  const [message, setMessage] = useState('')
  const [usePassword, setUsePassword] = useState(false)

  useEffect(() => {
    let mounted = true

    async function initAuth() {
      if (typeof window !== 'undefined' && window.location.href.includes('access_token')) {
        if (typeof (supabase.auth as any).getSessionFromUrl === 'function') {
          const { error } = await (supabase.auth as any).getSessionFromUrl({ storeSession: true })
          if (error) {
            setMessage(error.message)
          }
        }
      }

      const { data } = await supabase.auth.getUser()
      if (mounted) setUser(data.user ?? null)
    }

    initAuth()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      mounted = false
      // cleanup subscription
      // `listener` shape may vary, guard before calling
      // @ts-ignore
      listener?.subscription?.unsubscribe?.()
    }
  }, [])

  async function signIn() {
    setMessage('')
    if (usePassword) {
      if (!email || !password) {
        setMessage('Provide email and password.')
        return
      }
      setMessage('Signing in...')
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
      else setMessage(`Signed in as ${data.user?.email}`)
      return
    }

    setMessage('Sending sign-in link...')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
      },
    })
    if (error) setMessage(error.message)
    else setMessage('Check your email for the sign-in link.')
  }

  async function sendReset() {
    if (!forgotEmail) {
      setMessage('Enter your email to reset password.')
      return
    }
    setMessage('Sending reset email...')
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : undefined)
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: appUrl ? appUrl + '/reset-password' : undefined,
    })
    if (error) setMessage(error.message)
    else {
      setMessage('Password reset email sent. Check your inbox.')
      setForgotMode(false)
    }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      setMessage(error.message)
      return
    }
    setUser(null)
    setMessage('Signed out.')
  }

  return (
    <div className="flex items-center gap-3">
      {user ? (
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-700">{user.email}</span>
          <button className="text-sm text-sky-600" onClick={signOut}>
            Sign out
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {!forgotMode ? (
            <>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@school.edu"
                className="rounded border px-2 py-1 text-sm"
              />
              <input
                type={usePassword ? 'password' : 'text'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={usePassword ? 'Password' : 'Optional password'}
                className="rounded border px-2 py-1 text-sm"
              />
              <label className="text-sm flex items-center gap-2">
                <input type="checkbox" checked={usePassword} onChange={(e) => setUsePassword(e.target.checked)} />
                Use password
              </label>
              <button className="text-sm text-sky-600" onClick={signIn}>
                Sign in
              </button>
              <button className="text-sm text-gray-500" onClick={() => { setForgotMode(true); setForgotEmail(email); setMessage(''); }}>
                Forgot password?
              </button>
            </>
          ) : (
            <>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="Email to reset"
                className="rounded border px-2 py-1 text-sm"
              />
              <div className="flex items-center gap-2">
                <button className="text-sm text-sky-600" onClick={sendReset}>
                  Send reset email
                </button>
                <button className="text-sm px-2 py-1 rounded border" onClick={() => setForgotMode(false)}>
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}
      {message && <span className="text-xs text-gray-500">{message}</span>}
    </div>
  )
}
