import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	base: './', // rutas relativas: funciona en GitHub Pages
	server: { host: true, port: 5173, strictPort: true },
})
