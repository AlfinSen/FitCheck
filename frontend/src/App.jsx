import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TryOnPage from './components/TryOnPage'

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-white text-black font-sans selection:bg-yellow-200">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/tryon" element={<TryOnPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App