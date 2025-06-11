import React from 'react';
import './Footer.css';
import { FiMail, FiPhone, FiMapPin, FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">AI Kargo Seçim</h3>
            <p className="footer-description">
              Yapay zeka destekli akıllı kargo seçim sistemi ile gönderileriniz için en uygun kargo firmasını bulun.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Github">
                <FiGithub />
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <FiLinkedin />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <FiTwitter />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Hızlı Bağlantılar</h4>
            <ul className="footer-links">
              <li><a href="/">Ana Sayfa</a></li>
              <li><a href="/yeni-siparis">Yeni Sipariş</a></li>
              <li><a href="/siparisler">Siparişler</a></li>
              <li><a href="/kargolar">Kargo Yönetimi</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">İletişim</h4>
            <div className="contact-info">
              <div className="contact-item">
                <FiMail className="contact-icon" />
                <span>furkan.aslan6@ogr.sakarya.edu.tr</span>
              </div>
              <div className="contact-item">
                <FiPhone className="contact-icon" />
                <span>+90 552 217 65 61</span>
              </div>
              <div className="contact-item">
                <FiMapPin className="contact-icon" />
                <span>Esentepe Kampüsü, Esentepe, Üniversite Cd., 54050 Serdivan/Sakarya</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <div className="footer-copyright">
            <p>
              © {currentYear} AI Kargo Seçim. Tüm hakları saklıdır.
            </p>
            <p className="footer-creator">
              Created by <span className="creator-name">Furkan ASLAN</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
