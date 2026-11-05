import React, { StrictMode } from 'react'
import ReactDOM, { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

//pages imports
import App from './pages/App.jsx'
import HomePage from './pages/HomePage.jsx'

//router
const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
	},
	{
		path: "/homepage",
		element: <HomePage />,
	},
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
