import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import SiparisForm from './components/SiparisForm';
import SiparisListesi from './components/SiparisListesi';
import KargoYonetimi from './components/KargoYonetimi';
import Footer from './components/Footer/Footer';
import './App.css';
import { FiPackage, FiTruck, FiHome, FiPlusCircle, FiList } from 'react-icons/fi';

function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <div className="nav-brand">
              <FiPackage className="brand-icon" />
              <h1>Kargo Seçim Sistemi</h1>
            </div>
            <ul className="nav-menu">
              <li className={activeMenu === 'dashboard' ? 'active' : ''}>
                <Link to="/" onClick={() => setActiveMenu('dashboard')}>
                  <FiHome /> Ana Sayfa
                </Link>
              </li>
              <li className={activeMenu === 'yeni-siparis' ? 'active' : ''}>
                <Link to="/yeni-siparis" onClick={() => setActiveMenu('yeni-siparis')}>
                  <FiPlusCircle /> Yeni Sipariş
                </Link>
              </li>
              <li className={activeMenu === 'siparisler' ? 'active' : ''}>
                <Link to="/siparisler" onClick={() => setActiveMenu('siparisler')}>
                  <FiList /> Siparişler
                </Link>
              </li>
              <li className={activeMenu === 'kargolar' ? 'active' : ''}>
                <Link to="/kargolar" onClick={() => setActiveMenu('kargolar')}>
                  <FiTruck /> Kargo Yönetimi
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/yeni-siparis" element={<SiparisForm />} />
            <Route path="/siparisler" element={<SiparisListesi />} />
            <Route path="/kargolar" element={<KargoYonetimi />} />
          </Routes>
        </main>

        <Footer />

        <div className="background-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
    </Router>
  );
}

export default App;
