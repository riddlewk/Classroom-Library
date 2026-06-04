import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['**/__tests__/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    transformMode: {
      web: [/\.[jt]sx?$/],
    },
  },
})
