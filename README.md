### T.C.
### SAKARYA ÜNİVERSİTESİ
### FEN BİLİMLERİ ENSTİTÜSÜ
### BİLGİSAYAR VE BİLİŞİM MÜHENDİSLİĞİ ANABİLİM DALI
### BİLİŞİM TEKNOLOJİLERİ PR. (YL) (UZAKTAN EĞİTİM)	

### YAPAY ZEKA DESTEKLİ LOJİSTİK DAĞITIM SİSTEMİ

### Hazırlayan: FURKAN ASLAN
### Öğrenci Numarası: E245013004

### Danışman: Prof. Dr. Nilüfer YURTAY

### SAKARYA, 2025

# Kargo Seçim Sistemi

Bu proje, siparişler için en uygun kargo firmasını seçen bir web uygulamasıdır. Müşteri önceliklerine göre (hız, memnuniyet, güvenlik, fiyat) otomatik kargo seçimi yapılır.

## Kurulum

### Veritabanı Kurulumu

1. PostgreSQL'in kurulu olduğundan emin olun
2. `Database/kargo_secim_database.sql` dosyasını çalıştırın:
   ```bash
   psql -U postgres -f Database/kargo_secim_database.sql
   ```

### Backend Kurulumu

1. Backend klasörüne gidin:
   ```bash
   cd Backend
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   dotnet restore
   ```

3. Uygulamayı çalıştırın:
   ```bash
   dotnet run
   ```

Backend http://localhost:5000 adresinde çalışacaktır.

### Frontend Kurulumu

1. Frontend klasörüne gidin:
   ```bash
   cd Frontend
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

3. Uygulamayı başlatın:
   ```bash
   npm start
   ```

Frontend http://localhost:3000 adresinde açılacaktır.

## Kullanım

1. Yeni sipariş oluşturmak için "Yeni Sipariş" sayfasına gidin
2. Müşteri bilgilerini ve önceliği seçin
3. Sistem otomatik olarak en uygun kargoyu seçecektir
4. Siparişler sayfasından tüm siparişleri görebilirsiniz
5. Kargo Yönetimi sayfasından kargo firmalarını yönetebilirsiniz

## Özellikler

- Öncelik bazlı kargo seçimi
- Gerçek zamanlı sipariş takibi
- Kargo firma yönetimi
- Performans istatistikleri
- Modern ve kullanıcı dostu arayüz
