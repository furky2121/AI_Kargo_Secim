import React, { useState, useEffect } from 'react';
import { kargoAPI } from '../services/api';
import { FiTruck, FiEdit2, FiTrash2, FiPlus, FiX, FiCheck } from 'react-icons/fi';
import './KargoYonetimi.css';

function KargoYonetimi() {
  const [kargolar, setKargolar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingKargo, setEditingKargo] = useState(null);
  const [formData, setFormData] = useState({
    firmaAdi: '',
    hizPuani: '',
    memnuniyetPuani: '',
    hasarsizlikPuani: '',
    birimFiyat: '',
    aktifMi: true
  });

  useEffect(() => {
    loadKargolar();
  }, []);

  const loadKargolar = async () => {
    try {
      const response = await kargoAPI.getAll();
      setKargolar(response.data);
    } catch (error) {
      console.error('Kargo firmaları yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        hizPuani: parseFloat(formData.hizPuani),
        memnuniyetPuani: parseFloat(formData.memnuniyetPuani),
        hasarsizlikPuani: parseFloat(formData.hasarsizlikPuani),
        birimFiyat: parseFloat(formData.birimFiyat)
      };

      if (editingKargo) {
        await kargoAPI.update(editingKargo.id, data);
      } else {
        await kargoAPI.create(data);
      }

      await loadKargolar();
      resetForm();
    } catch (error) {
      console.error('Kargo kaydedilirken hata:', error);
    }
  };

  const handleEdit = (kargo) => {
    setEditingKargo(kargo);
    setFormData({
      firmaAdi: kargo.firmaAdi,
      hizPuani: kargo.hizPuani.toString(),
      memnuniyetPuani: kargo.memnuniyetPuani.toString(),
      hasarsizlikPuani: kargo.hasarsizlikPuani.toString(),
      birimFiyat: kargo.birimFiyat.toString(),
      aktifMi: kargo.aktifMi
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu kargo firmasını silmek istediğinizden emin misiniz?')) {
      try {
        await kargoAPI.delete(id);
        await loadKargolar();
      } catch (error) {
        console.error('Kargo silinirken hata:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      firmaAdi: '',
      hizPuani: '',
      memnuniyetPuani: '',
      hasarsizlikPuani: '',
      birimFiyat: '',
      aktifMi: true
    });
    setEditingKargo(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="kargo-yonetimi fade-in">
      <div className="page-header">
        <h2 className="page-title">
          <FiTruck /> Kargo Firmaları Yönetimi
        </h2>
        <button onClick={() => setShowForm(true)} className="btn-gradient add-btn">
          <FiPlus /> Yeni Kargo Firması Ekle
        </button>
      </div>

      <div className="kargo-table-container card">
        <table className="kargo-table">
          <thead>
            <tr>
              <th>Firma Adı</th>
              <th>Hız Puanı</th>
              <th>Memnuniyet</th>
              <th>Hasarsızlık</th>
              <th>Birim Fiyat</th>
              <th>Durum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {kargolar.map(kargo => (
              <tr key={kargo.id} className={!kargo.aktifMi ? 'inactive' : ''}>
                <td className="firma-name">{kargo.firmaAdi}</td>
                <td>
                  <div className="score-cell">
                    <div className="score-bar-mini">
                      <div 
                        className="score-fill-mini" 
                        style={{ width: `${kargo.hizPuani * 10}%` }}
                      ></div>
                    </div>
                    <span>{kargo.hizPuani}/10</span>
                  </div>
                </td>
                <td>
                  <div className="score-cell">
                    <div className="score-bar-mini">
                      <div 
                        className="score-fill-mini" 
                        style={{ width: `${kargo.memnuniyetPuani * 10}%` }}
                      ></div>
                    </div>
                    <span>{kargo.memnuniyetPuani}/10</span>
                  </div>
                </td>
                <td>
                  <div className="score-cell">
                    <div className="score-bar-mini">
                      <div 
                        className="score-fill-mini" 
                        style={{ width: `${kargo.hasarsizlikPuani * 10}%` }}
                      ></div>
                    </div>
                    <span>{kargo.hasarsizlikPuani}/10</span>
                  </div>
                </td>
                <td className="price-cell">{kargo.birimFiyat} ₺</td>
                <td>
                  <span className={`status-chip ${kargo.aktifMi ? 'active' : 'inactive'}`}>
                    {kargo.aktifMi ? 'Aktif' : 'Pasif'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      onClick={() => handleEdit(kargo)}
                      className="action-btn edit-btn"
                      title="Düzenle"
                    >
                      <FiEdit2 />
                    </button>
                    <button 
                      onClick={() => handleDelete(kargo.id)}
                      className="action-btn delete-btn"
                      title="Sil"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content kargo-form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingKargo ? 'Kargo Firması Düzenle' : 'Yeni Kargo Firması Ekle'}</h3>
              <button onClick={resetForm} className="close-modal-btn">
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="kargo-form">
              <div className="form-group">
                <label htmlFor="firmaAdi">Firma Adı</label>
                <input
                  type="text"
                  id="firmaAdi"
                  name="firmaAdi"
                  value={formData.firmaAdi}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="hizPuani">Hız Puanı (1-10)</label>
                  <input
                    type="number"
                    id="hizPuani"
                    name="hizPuani"
                    value={formData.hizPuani}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    step="0.1"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="memnuniyetPuani">Memnuniyet Puanı (1-10)</label>
                  <input
                    type="number"
                    id="memnuniyetPuani"
                    name="memnuniyetPuani"
                    value={formData.memnuniyetPuani}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    step="0.1"
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="hasarsizlikPuani">Hasarsızlık Puanı (1-10)</label>
                  <input
                    type="number"
                    id="hasarsizlikPuani"
                    name="hasarsizlikPuani"
                    value={formData.hasarsizlikPuani}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    step="0.1"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="birimFiyat">Birim Fiyat (₺)</label>
                  <input
                    type="number"
                    id="birimFiyat"
                    name="birimFiyat"
                    value={formData.birimFiyat}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="aktifMi"
                    checked={formData.aktifMi}
                    onChange={handleChange}
                  />
                  <span>Aktif</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="cancel-btn">
                  <FiX /> İptal
                </button>
                <button type="submit" className="btn-gradient save-btn">
                  <FiCheck /> {editingKargo ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default KargoYonetimi;
