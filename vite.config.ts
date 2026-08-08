import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Icons are decorative by default, so hide them from assistive tech and
    // keep them out of the tab order. Any icon that carries meaning on its own
    // gets an accessible name from its parent link or button instead.
    svgr({ svgrOptions: { svgProps: { 'aria-hidden': 'true', focusable: 'false' } } }),
  ],
  build: {
    rollupOptions: {
      output: {
        // Split the large, rarely-changing dependencies into their own chunks so
        // a content change does not invalidate the whole vendor payload.
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return
          if (/[\\/]framer-motion[\\/]/.test(id)) return 'motion'
          if (/[\\/]@radix-ui[\\/]/.test(id)) return 'radix'
          if (/[\\/](@tanstack|axios)[\\/]/.test(id)) return 'query'
          if (/[\\/](react|react-dom|react-router|scheduler)[\\/]/.test(id)) return 'react'
        },
      },
    },
  },
})
