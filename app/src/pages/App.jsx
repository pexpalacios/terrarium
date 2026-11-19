import { useState } from 'react'
import { useNavigate } from 'react-router'

import heroImg from '../assets/hero.png'
import reactLogo from '../assets/react.svg'
import viteLogo from '../assets/vite.svg'

import './App.css'

function App() {
	const [count, setCount] = useState(0);
	const navigate = useNavigate();

  return (
    <>
      <section id="center" className="flex flex-col gap-6 items-center justify-center min-h-screen min-w-screen bg-slate-200">
        <p>This is a menu. It's still being designed.</p>
		<button
          type="button"
          className="bg-amber-500 p-3 rounded-md hover:bg-amber-600 text-slate-50 font-bold"
          onClick={() => navigate("/game")}
        >
          Go to game
        </button>
      </section>
    </>
  )
}

export default App
