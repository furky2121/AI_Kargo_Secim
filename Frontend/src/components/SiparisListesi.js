import React, { useState, useEffect } from 'react';
import { siparisAPI } from '../services/api';
import { FiPackage, FiTruck, FiMapPin, FiCalendar, FiEye, FiCheckCircle, FiClock, FiRefreshCw, FiList, FiUser } from 'react-icons/fi';
import './SiparisListesi.css';

function SiparisListesi() {
  const [siparisler, setSiparisler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSiparis, setSelectedSiparis] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadSiparisler();
  }, []);

  const loadSiparisler = async () => {
    setLoading(true);
    try {
      const response = await siparisAPI.getAll();
      setSiparisler(response.data);
    } catch (error) {
      console.error('Siparişler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, yeniDurum) => {
    try {
      await siparisAPI.updateStatus(id, yeniDurum);
      await loadSiparisler();
    } catch (error) {
      console.error('Durum güncellenirken hata:', error);
    }
  };

  const getStatusIcon = (durum) => {
    switch (durum) {
      case 'Kargo Atandı':
        return <FiTruck className="status-icon" style={{ transform: 'rotate(0deg)' }} />;
      case 'Yolda':
        return <FiClock className="status-icon" style={{ transform: 'rotate(0deg)' }} />;
      case 'Teslim Edildi':
        return <FiCheckCircle className="status-icon" style={{ transform: 'rotate(0deg)' }} />;
      default:
        return <FiPackage className="status-icon" style={{ transform: 'rotate(0deg)' }} />;
    }
  };

  const filteredSiparisler = filter === 'all' 
    ? siparisler 
    : siparisler.filter(s => s.durum === filter);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="siparis-listesi fade-in">
      <div className="list-header">
        <h2 className="page-title">
          <FiList /> Sipariş Listesi
        </h2>
        <button onClick={loadSiparisler} className="refresh-btn">
          <FiRefreshCw /> Yenile
        </button>
      </div>

      <div className="filter-buttons">
        <button 
          className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('all')}
        >
          Tümü ({siparisler.length})
        </button>
        <button 
          className={filter === 'Kargo Atandı' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('Kargo Atandı')}
        >
          Kargo Atandı ({siparisler.filter(s => s.durum === 'Kargo Atandı').length})
        </button>
        <button 
          className={filter === 'Yolda' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('Yolda')}
        >
          Yolda ({siparisler.filter(s => s.durum === 'Yolda').length})
        </button>
        <button 
          className={filter === 'Teslim Edildi' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('Teslim Edildi')}
        >
          Teslim Edildi ({siparisler.filter(s => s.durum === 'Teslim Edildi').length})
        </button>
      </div>

      <div className="siparis-grid">
        {filteredSiparisler.map(siparis => (
          <div key={siparis.id} className="siparis-card card glass">
            <div className="siparis-header">
              <div className="siparis-no">{siparis.siparisNo}</div>
              <div className={`status-badge status-${siparis.durum.replace(/\s+/g, '-').toLowerCase()}`}>
                {getStatusIcon(siparis.durum)}
                {siparis.durum}
              </div>
            </div>

            <div className="siparis-body">
              <div className="info-row">
                <FiUser className="info-icon" />
                <span className="info-label">Müşteri:</span>
                <span className="info-value">{siparis.musteriAdi}</span>
              </div>

              <div className="info-row">
                <FiMapPin className="info-icon" />
                <span className="info-label">İl:</span>
                <span className="info-value">{siparis.il || 'Belirtilmemiş'}</span>
              </div>

              <div className="info-row">
                <FiMapPin className="info-icon" />
                <span className="info-label">İlçe:</span>
                <span className="info-value">{siparis.ilce || 'Belirtilmemiş'}</span>
              </div>

              <div className="info-row">
                <FiMapPin className="info-icon" />
                <span className="info-label">Adres:</span>
                <span className="info-value">{siparis.adres}</span>
              </div>

              <div className="info-row">
                <FiPackage className="info-icon" />
                <span className="info-label">Ağırlık:</span>
                <span className="info-value">{siparis.agirlik} kg</span>
              </div>

              {siparis.seciliKargo && (
                <div className="info-row">
                  <FiTruck className="info-icon" />
                  <span className="info-label">Kargo:</span>
                  <span className="info-value kargo-name">{siparis.seciliKargo.firmaAdi}</span>
                </div>
              )}

              <div className="info-row">
                <FiCalendar className="info-icon" />
                <span className="info-label">Tarih:</span>
                <span className="info-value">
                  {new Date(siparis.olusturmaTarihi).toLocaleDateString('tr-TR')}
                </span>
              </div>
            </div>

            <div className="siparis-actions">
              <button 
                onClick={() => setSelectedSiparis(siparis)}
                className="action-btn view-btn"
              >
                <FiEye /> Detay
              </button>

              {siparis.durum !== 'Teslim Edildi' && (
                <select 
                  value={siparis.durum}
                  onChange={(e) => handleStatusUpdate(siparis.id, e.target.value)}
                  className="status-select"
                >
                  <option value="Bekliyor">Bekliyor</option>
                  <option value="Kargo Atandı">Kargo Atandı</option>
                  <option value="Yolda">Yolda</option>
                  <option value="Teslim Edildi">Teslim Edildi</option>
                </select>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredSiparisler.length === 0 && (
        <div className="empty-state">
          <FiPackage size={64} />
          <h3>Sipariş bulunamadı</h3>
          <p>Seçilen filtreye uygun sipariş bulunmamaktadır.</p>
        </div>
      )}

      {selectedSiparis && (
        <div className="modal-overlay" onClick={() => setSelectedSiparis(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Sipariş Detayları</h3>
            
            <div className="detail-section">
              <h4>Sipariş Bilgileri</h4>
              <p><strong>Sipariş No:</strong> {selectedSiparis.siparisNo}</p>
              <p><strong>Müşteri:</strong> {selectedSiparis.musteriAdi}</p>
              <p><strong>İl:</strong> {selectedSiparis.il || 'Belirtilmemiş'}</p>
              <p><strong>İlçe:</strong> {selectedSiparis.ilce || 'Belirtilmemiş'}</p>
              <p><strong>Adres:</strong> {selectedSiparis.adres}</p>
              <p><strong>Ağırlık:</strong> {selectedSiparis.agirlik} kg</p>
              <p><strong>Öncelik:</strong> {selectedSiparis.oncelik}</p>
              <p><strong>Durum:</strong> {selectedSiparis.durum}</p>
              <p><strong>Oluşturma Tarihi:</strong> {new Date(selectedSiparis.olusturmaTarihi).toLocaleString('tr-TR')}</p>
            </div>

            {selectedSiparis.seciliKargo && (
              <div className="detail-section">
                <h4>Kargo Bilgileri</h4>
                <p><strong>Firma:</strong> {selectedSiparis.seciliKargo.firmaAdi}</p>
                <p><strong>Birim Fiyat:</strong> {selectedSiparis.seciliKargo.birimFiyat} ₺</p>
              </div>
            )}

            {selectedSiparis.aiTavsiyesi && (
              <div className="detail-section">
                <h4>AI Tavsiyesi</h4>
                <pre className="ai-recommendation">{selectedSiparis.aiTavsiyesi}</pre>
              </div>
            )}

            <button onClick={() => setSelectedSiparis(null)} className="close-btn">
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SiparisListesi;
