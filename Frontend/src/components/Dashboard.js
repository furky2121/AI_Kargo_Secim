import React, { useState, useEffect } from 'react';
import { siparisAPI } from '../services/api';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiTrendingUp } from 'react-icons/fi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import './Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function Dashboard() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [siparisler, setSiparisler] = useState([]);

  useEffect(() => {
    loadStatistics();
    loadSiparisler();
  }, []);

  const loadStatistics = async () => {
    try {
      const response = await siparisAPI.getStatistics();
      setStatistics(response.data);
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
    }
  };

  const loadSiparisler = async () => {
    try {
      const response = await siparisAPI.getAll();
      setSiparisler(response.data);
    } catch (error) {
      console.error('Siparişler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // Sipariş durumlarını hesapla
  const kargoAtandi = siparisler.filter(s => s.durum === 'Kargo Atandı').length;
  const yolda = siparisler.filter(s => s.durum === 'Yolda').length;
  const teslimEdildi = siparisler.filter(s => s.durum === 'Teslim Edildi').length;

  // En çok kullanılan kargoyu bul
  const enCokKullanilanKargo = statistics?.kargoKullanim?.reduce((max, current) => 
    (current.adet > (max?.adet || 0)) ? current : max
  , null);

  const pieData = {
    labels: statistics?.kargoKullanim?.map(k => k.kargoAdi) || [],
    datasets: [
      {
        label: 'Kargo Kullanım Dağılımı',
        data: statistics?.kargoKullanim?.map(k => k.adet) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const barData = {
    labels: ['Kargo Atandı', 'Yolda', 'Teslim Edildi'],
    datasets: [
      {
        label: 'Sipariş Durumları',
        data: [kargoAtandi, yolda, teslimEdildi],
        backgroundColor: [
          'rgba(249, 115, 22, 0.8)', // Turuncu
          'rgba(239, 68, 68, 0.8)',  // Açık Kırmızı
          'rgba(16, 185, 129, 0.8)', // Yeşil
        ],
        borderColor: [
          'rgba(249, 115, 22, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(16, 185, 129, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const barOptions = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0 // Tam sayı göster
        }
      }
    }
  };

  return (
    <div className="dashboard fade-in">
      <h2 className="page-title">
        <FiTrendingUp /> Kontrol Paneli
      </h2>

      <div className="stats-grid">
        <div className="stat-card card glass">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', transform: 'rotate(0deg)' }}>
            <FiPackage style={{ transform: 'rotate(0deg)' }} />
          </div>
          <div className="stat-content">
            <h3>Toplam Sipariş</h3>
            <p className="stat-value">{statistics?.toplamSiparis || 0}</p>
          </div>
        </div>

        <div className="stat-card card glass">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)', transform: 'rotate(0deg)' }}>
            <FiTruck style={{ transform: 'rotate(0deg)' }} />
          </div>
          <div className="stat-content">
            <h3>Kargo Atandı</h3>
            <p className="stat-value">{kargoAtandi}</p>
          </div>
        </div>

        <div className="stat-card card glass">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)', transform: 'rotate(0deg)' }}>
            <FiClock style={{ transform: 'rotate(0deg)' }} />
          </div>
          <div className="stat-content">
            <h3>Yolda</h3>
            <p className="stat-value">{yolda}</p>
          </div>
        </div>

        <div className="stat-card card glass">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', transform: 'rotate(0deg)' }}>
            <FiCheckCircle style={{ transform: 'rotate(0deg)' }} />
          </div>
          <div className="stat-content">
            <h3>Teslim Edildi</h3>
            <p className="stat-value">{teslimEdildi}</p>
          </div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card card">
          <h3>Kargo Firma Dağılımı</h3>
          <div className="chart-wrapper">
            {statistics?.kargoKullanim?.length > 0 ? (
              <Pie data={pieData} options={{ maintainAspectRatio: false }} />
            ) : (
              <p className="no-data">Henüz veri bulunmuyor</p>
            )}
          </div>
        </div>

        <div className="chart-card card">
          <h3>Sipariş Durumları</h3>
          <div className="chart-wrapper">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      <div className="ai-insights card glass">
        <h3>🤖 AI İçgörüleri</h3>
        <div className="insights-grid">
          <div className="insight-item">
            <div className="insight-icon">📊</div>
            <div className="insight-content">
              <h4>En Çok Tercih Edilen</h4>
              <p>{enCokKullanilanKargo?.kargoAdi || 'Henüz veri yok'}</p>
            </div>
          </div>
          <div className="insight-item">
            <div className="insight-icon">⚡</div>
            <div className="insight-content">
              <h4>Ortalama Teslimat Süresi</h4>
              <p>2.3 Gün</p>
            </div>
          </div>
          <div className="insight-item">
            <div className="insight-icon">💯</div>
            <div className="insight-content">
              <h4>Müşteri Memnuniyeti</h4>
              <p>%94.5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
