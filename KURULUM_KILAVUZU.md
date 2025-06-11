# AI Kargo Seçim Sistemi - Kurulum Kılavuzu

Bu kılavuz, AI destekli kargo seçim sistemini bilgisayarınızda nasıl çalıştıracağınızı adım adım anlatır.

## Gerekli Programlar

Öncelikle aşağıdaki programların bilgisayarınızda kurulu olması gerekiyor:

### 1. Node.js (Frontend için)
- https://nodejs.org adresine gidin
- "LTS" versiyonunu indirin ve kurun
- Kurulum sırasında tüm seçenekleri varsayılan bırakın

### 2. .NET 8 SDK (Backend için)
- https://dotnet.microsoft.com/download/dotnet/8.0 adresine gidin
- ".NET 8.0 SDK" bölümünden Windows versiyonunu indirin
- Kurulum dosyasını çalıştırın

### 3. PostgreSQL (Veritabanı için)
- https://www.postgresql.org/download/windows/ adresine gidin
- "Download the installer" butonuna tıklayın
- En son versiyonu indirin (örn: PostgreSQL 16)
- Kurulum sırasında:
  - Şifre olarak "postgres" yazın (UNUTMAYIN!)
  - Port: 5432 (varsayılan)
  - Diğer ayarları varsayılan bırakın

### 4. Visual Studio Code (Kod editörü - isteğe bağlı)
- https://code.visualstudio.com adresinden indirin
- Kodları görmek/düzenlemek için kullanabilirsiniz

## Kurulum Adımları

### Adım 1: Veritabanını Oluşturma

1. Başlat menüsünden "pgAdmin 4" programını açın
2. Sol tarafta "Servers" > "PostgreSQL" tıklayın
3. Şifre sorarsa kurulumda belirlediğiniz şifreyi girin (postgres)
4. "Databases" üzerine sağ tıklayın > "Create" > "Database"
5. Name: `kargo_secim_db` yazın ve "Save" tıklayın
6. Oluşan veritabanına sağ tıklayın > "Query Tool" seçin
7. `C:\Users\480s\Desktop\AI_Kargo_Secim\Database\create_database.sql` dosyasını açın
8. İçeriğini kopyalayıp Query Tool'a yapıştırın
9. "Execute" butonuna (▶️) tıklayın

### Adım 2: Backend'i Çalıştırma

1. Windows PowerShell'i açın (Başlat > PowerShell yazın)
2. Şu komutları sırayla yazın:

```powershell
cd C:\Users\480s\Desktop\AI_Kargo_Secim\Backend
dotnet restore
dotnet run
```

3. "Now listening on: https://localhost:7001" yazısını görünce backend çalışıyor demektir
4. Bu pencereyi AÇIK BIRAKIN

### Adım 3: Frontend'i Çalıştırma

1. YENİ bir PowerShell penceresi açın
2. Şu komutları sırayla yazın:

```powershell
cd C:\Users\480s\Desktop\AI_Kargo_Secim\Frontend
npm install
npm start
```

3. Biraz bekleyin (ilk kurulumda 2-5 dakika sürebilir)
4. Otomatik olarak tarayıcınız açılacak ve http://localhost:3000 adresine gidecek
5. Sistem kullanıma hazır!

## Sistemi Kullanma

### Ana Sayfa (Dashboard)
- İstatistikleri ve grafikleri gösterir
- Toplam sipariş sayısı, bekleyen siparişler vb.

### Yeni Sipariş
- Müşteri adı, adres ve ağırlık bilgilerini girin
- Öncelik seçin (Hız, Memnuniyet, Hasarsızlık, Fiyat veya Dengeli)
- "Sipariş Oluştur" butonuna tıklayın
- AI otomatik olarak en uygun kargoyu seçecek

### Siparişler
- Tüm siparişleri listeler
- Durumları güncelleyebilirsiniz
- Detayları görebilirsiniz

### Kargo Yönetimi
- Yeni kargo firması ekleyebilirsiniz
- Mevcut firmaları düzenleyebilirsiniz
- Puanları güncelleyebilirsiniz

## Sorun Giderme

### Backend çalışmıyor
- .NET 8 SDK'nın kurulu olduğundan emin olun
- `dotnet --version` komutu ile kontrol edin

### Frontend çalışmıyor
- Node.js'in kurulu olduğundan emin olun
- `node --version` komutu ile kontrol edin
- `npm install` komutunu tekrar çalıştırın

### Veritabanı bağlantı hatası
- PostgreSQL servisinin çalıştığından emin olun
- Şifrenin doğru olduğundan emin olun
- `appsettings.json` dosyasındaki bağlantı bilgilerini kontrol edin

### Port kullanımda hatası
- Başka bir program 3000 veya 7001 portunu kullanıyor olabilir
- Tüm tarayıcı pencerelerini kapatıp tekrar deneyin

## Sistemi Kapatma

1. Frontend PowerShell penceresinde Ctrl+C tuşlarına basın
2. Backend PowerShell penceresinde Ctrl+C tuşlarına basın
3. pgAdmin'i kapatabilirsiniz

## Sistemi Tekrar Açma

1. Backend PowerShell: `cd C:\Users\480s\Desktop\AI_Kargo_Secim\Backend` ve `dotnet run`
2. Frontend PowerShell: `cd C:\Users\480s\Desktop\AI_Kargo_Secim\Frontend` ve `npm start`

## Notlar

- İlk kurulumdan sonra `npm install` ve `dotnet restore` komutlarını tekrar çalıştırmanıza gerek yok
- Sistem her açıldığında veritabanındaki veriler korunur
- Yedekleme için pgAdmin'den veritabanını dışa aktarabilirsiniz
