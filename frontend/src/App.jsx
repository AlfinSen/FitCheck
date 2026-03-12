import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TryOnPage from './components/TryOnPage'
import Collections from './components/Collections'
import RecentTryOns from './components/RecentTryOns'

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-white text-black font-sans selection:bg-yellow-200">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/tryon" element={<TryOnPage />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/recent" element={<RecentTryOns />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App