import React, { useState, useEffect } from 'react';
import { siparisAPI, kargoAPI, ilIlceAPI } from '../services/api';
import { FiPackage, FiMapPin, FiUser, FiTruck, FiSend } from 'react-icons/fi';
import './SiparisForm.css';

function SiparisForm() {
  const [formData, setFormData] = useState({
    musteriAdi: '',
    ilId: '',
    ilceId: '',
    adres: '',
    agirlik: '',
    oncelik: 'Dengeli'
  });
  const [iller, setIller] = useState([]);
  const [ilceler, setIlceler] = useState([]);
  const [kargolar, setKargolar] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [aiResult, setAiResult] = useState(null);

  useEffect(() => {
    loadKargolar();
    loadIller();
  }, []);

  useEffect(() => {
    if (formData.ilId) {
      loadIlceler(formData.ilId);
    } else {
      setIlceler([]);
      setFormData(prev => ({ ...prev, ilceId: '' }));
    }
  }, [formData.ilId]);

  const loadKargolar = async () => {
    try {
      const response = await kargoAPI.getAll();
      setKargolar(response.data);
    } catch (error) {
      console.error('Kargo firmaları yüklenirken hata:', error);
    }
  };

  const loadIller = async () => {
    try {
      const response = await ilIlceAPI.getIller();
      setIller(response.data);
    } catch (error) {
      console.error('İller yüklenirken hata:', error);
    }
  };

  const loadIlceler = async (ilId) => {
    try {
      const response = await ilIlceAPI.getIlceler(ilId);
      setIlceler(response.data);
    } catch (error) {
      console.error('İlçeler yüklenirken hata:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    setAiResult(null);

    try {
      // Önce siparişi oluştur
      const siparisResponse = await siparisAPI.create({
        ...formData,
        ilId: parseInt(formData.ilId),
        ilceId: parseInt(formData.ilceId),
        agirlik: parseFloat(formData.agirlik)
      });

      const siparis = siparisResponse.data;

      // En uygun kargoyu bul
      const kargoResponse = await siparisAPI.selectKargo(siparis.id);
      const { secilenKargo } = kargoResponse.data;

      setAiResult({
        siparis: kargoResponse.data.siparis,
        secilenKargo
      });

      setMessage({
        type: 'success',
        text: `Sipariş başarıyla oluşturuldu! ${secilenKargo.firmaAdi} firması seçildi.`
      });

      // Formu temizle
      setFormData({
        musteriAdi: '',
        ilId: '',
        ilceId: '',
        adres: '',
        agirlik: '',
        oncelik: 'Dengeli'
      });
      setIlceler([]);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Sipariş oluşturulurken bir hata oluştu.'
      });
      console.error('Hata:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="siparis-form-container fade-in">
      <h2 className="page-title">
        <FiPackage /> Yeni Sipariş Oluştur
      </h2>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="form-layout">
        <div className="form-section">
          <form onSubmit={handleSubmit} className="siparis-form card glass">
            <div className="form-group">
              <label htmlFor="musteriAdi">
                <FiUser /> Müşteri Adı
              </label>
              <input
                type="text"
                id="musteriAdi"
                name="musteriAdi"
                value={formData.musteriAdi}
                onChange={handleChange}
                required
                placeholder="Müşteri adını giriniz"
                className="form-input"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ilId">
                  <FiMapPin /> İl
                </label>
                <select
                  id="ilId"
                  name="ilId"
                  value={formData.ilId}
                  onChange={handleChange}
                  required
                  className="form-input"
                >
                  <option value="">İl Seçiniz</option>
                  {iller.map(il => (
                    <option key={il.id} value={il.id}>{il.ilAdi}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="ilceId">
                  <FiMapPin /> İlçe
                </label>
                <select
                  id="ilceId"
                  name="ilceId"
                  value={formData.ilceId}
                  onChange={handleChange}
                  required
                  className="form-input"
                  disabled={!formData.ilId}
                >
                  <option value="">İlçe Seçiniz</option>
                  {ilceler.map(ilce => (
                    <option key={ilce.id} value={ilce.id}>{ilce.ilceAdi}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="adres">
                <FiMapPin /> Açık Adres
              </label>
              <textarea
                id="adres"
                name="adres"
                value={formData.adres}
                onChange={handleChange}
                required
                placeholder="Mahalle, sokak, bina no vb. detayları giriniz"
                rows="3"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="agirlik">
                <FiPackage /> Ağırlık (kg)
              </label>
              <input
                type="number"
                id="agirlik"
                name="agirlik"
                value={formData.agirlik}
                onChange={handleChange}
                required
                step="0.1"
                min="0.1"
                placeholder="Örn: 2.5"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="oncelik">
                <FiTruck /> Öncelik
              </label>
              <select
                id="oncelik"
                name="oncelik"
                value={formData.oncelik}
                onChange={handleChange}
                className="form-input"
              >
                <option value="Dengeli">Dengeli (Tüm faktörler eşit)</option>
                <option value="Hız">Hız (En hızlı teslimat)</option>
                <option value="Memnuniyet">Memnuniyet (En yüksek müşteri puanı)</option>
                <option value="Hasarsızlık">Hasarsızlık (En güvenli taşıma)</option>
                <option value="Fiyat">Fiyat (En ekonomik)</option>
              </select>
            </div>

            <button type="submit" className="btn-gradient submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner-small"></div>
                  İşleniyor...
                </>
              ) : (
                <>
                  <FiSend /> Sipariş Oluştur ve Kargo Seç
                </>
              )}
            </button>
          </form>
        </div>

        <div className="info-section">
          {aiResult ? (
            <div className="ai-result card glass">
              <h3>🚚 Kargo Seçimi Tamamlandı!</h3>
              <div className="result-details">
                <div className="selected-cargo">
                  <h4>Seçilen Kargo:</h4>
                  <div className="cargo-info">
                    <div className="cargo-name">{aiResult.secilenKargo.firmaAdi}</div>
                    <div className="cargo-price">Birim Fiyat: {aiResult.secilenKargo.birimFiyat} ₺</div>
                  </div>
                </div>
                
                <div className="ai-explanation">
                  <h4>Seçim Analizi:</h4>
                  <pre className="recommendation-text">{aiResult.siparis.aiTavsiyesi}</pre>
                </div>

                <div className="order-info">
                  <p><strong>Sipariş No:</strong> {aiResult.siparis.siparisNo}</p>
                  <p><strong>Durum:</strong> <span className="status-badge">{aiResult.siparis.durum}</span></p>
                </div>
              </div>
            </div>
          ) : (
            <div className="info-card card glass">
              <h3>📊 Kargo Firmaları</h3>
              <div className="kargo-list">
                {kargolar.map(kargo => (
                  <div key={kargo.id} className="kargo-item">
                    <div className="kargo-header">
                      <h4>{kargo.firmaAdi}</h4>
                      <span className="kargo-price">{kargo.birimFiyat} ₺</span>
                    </div>
                    <div className="kargo-scores">
                      <div className="score-item">
                        <span className="score-label">Hız:</span>
                        <div className="score-bar">
                          <div 
                            className="score-fill" 
                            style={{ width: `${kargo.hizPuani * 10}%` }}
                          ></div>
                        </div>
                        <span className="score-value">{kargo.hizPuani}/10</span>
                      </div>
                      <div className="score-item">
                        <span className="score-label">Memnuniyet:</span>
                        <div className="score-bar">
                          <div 
                            className="score-fill" 
                            style={{ width: `${kargo.memnuniyetPuani * 10}%` }}
                          ></div>
                        </div>
                        <span className="score-value">{kargo.memnuniyetPuani}/10</span>
                      </div>
                      <div className="score-item">
                        <span className="score-label">Hasarsızlık:</span>
                        <div className="score-bar">
                          <div 
                            className="score-fill" 
                            style={{ width: `${kargo.hasarsizlikPuani * 10}%` }}
                          ></div>
                        </div>
                        <span className="score-value">{kargo.hasarsizlikPuani}/10</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SiparisForm;
