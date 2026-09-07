import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Assistant from './pages/Assistant'
import ProductCompliance from './pages/ProductCompliance'
import StandardsSearch from './pages/StandardsSearch'
import BisServices from './pages/BisServices'
import Compliance from './pages/Compliance'
import About from './pages/About'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/compliance-checker" element={<ProductCompliance />} />
            <Route path="/standards-search" element={<StandardsSearch />} />
            <Route path="/bis-services" element={<BisServices />} />
            <Route path="/compliance" element={<Compliance />} />
            <Route path="/about" element={<About />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
