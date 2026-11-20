import React, { StrictMode } from 'react'
import ReactDOM, { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './index.css'
import './i18n';

//pages imports
import App from './pages/App.jsx'
import Game from './pages/Game.jsx'

//router
const router = createBrowserRouter(
	[
		{
			path: "/",
			element: <App />,
		},
		{
			path: "/game",
			element: <Game />,
		},
		{
			path: '*', 
			element: <ErrorPage notFound />
		}
	],
	{
		basename: import.meta.env.BASE_URL
	}
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
