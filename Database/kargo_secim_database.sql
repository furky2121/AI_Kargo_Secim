-- Kargo seçim sistemi veritabanı kurulum dosyası
-- Bu dosyayı PostgreSQL'de çalıştırarak sistemi kurabilirsiniz

-- Önce veritabanını oluşturuyoruz
CREATE DATABASE kargo_secim_db;

-- Oluşturduğumuz veritabanına geçiş yapıyoruz
\c kargo_secim_db;

-- Kargo firmalarının bilgilerini tutacağımız tablo
CREATE TABLE IF NOT EXISTS "Kargolar" (
    "Id" SERIAL PRIMARY KEY,
    "FirmaAdi" VARCHAR(100) NOT NULL,
    "HizPuani" DECIMAL(3,1) NOT NULL CHECK ("HizPuani" >= 1 AND "HizPuani" <= 10),
    "MemnuniyetPuani" DECIMAL(3,1) NOT NULL CHECK ("MemnuniyetPuani" >= 1 AND "MemnuniyetPuani" <= 10),
    "HasarsizlikPuani" DECIMAL(3,1) NOT NULL CHECK ("HasarsizlikPuani" >= 1 AND "HasarsizlikPuani" <= 10),
    "BirimFiyat" DECIMAL(18,2) NOT NULL,
    "AktifMi" BOOLEAN NOT NULL DEFAULT TRUE,
    "OlusturmaTarihi" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Türkiye'deki illeri kaydedeceğimiz tablo
CREATE TABLE IF NOT EXISTS "Iller" (
    "Id" SERIAL PRIMARY KEY,
    "IlAdi" VARCHAR(50) NOT NULL UNIQUE,
    "PlakaKodu" INTEGER NOT NULL UNIQUE
);

-- İllere bağlı ilçeleri tutacağımız tablo
CREATE TABLE IF NOT EXISTS "Ilceler" (
    "Id" SERIAL PRIMARY KEY,
    "IlId" INTEGER NOT NULL,
    "IlceAdi" VARCHAR(50) NOT NULL,
    FOREIGN KEY ("IlId") REFERENCES "Iller"("Id") ON DELETE CASCADE
);

-- Müşteri siparişlerini kaydettiğimiz ana tablo
CREATE TABLE IF NOT EXISTS "Siparisler" (
    "Id" SERIAL PRIMARY KEY,
    "SiparisNo" VARCHAR(50) NOT NULL UNIQUE,
    "MusteriAdi" VARCHAR(200) NOT NULL,
    "IlId" INTEGER NOT NULL,
    "IlceId" INTEGER NOT NULL,
    "Adres" TEXT NOT NULL,
    "Agirlik" DECIMAL(10,2) NOT NULL,
    "Oncelik" VARCHAR(50) NOT NULL DEFAULT 'Dengeli',
    "SeciliKargoId" INTEGER,
    "Durum" VARCHAR(50) NOT NULL DEFAULT 'Bekliyor',
    "OlusturmaTarihi" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "AITavsiyesi" TEXT,
    FOREIGN KEY ("SeciliKargoId") REFERENCES "Kargolar"("Id") ON DELETE SET NULL,
    FOREIGN KEY ("IlId") REFERENCES "Iller"("Id"),
    FOREIGN KEY ("IlceId") REFERENCES "Ilceler"("Id")
);

-- Kargo firmalarının performans istatistiklerini takip eden tablo
CREATE TABLE IF NOT EXISTS "KargoPerformanslari" (
    "Id" SERIAL PRIMARY KEY,
    "KargoId" INTEGER NOT NULL,
    "ToplamGonderi" INTEGER NOT NULL DEFAULT 0,
    "ZamanindaTeslim" INTEGER NOT NULL DEFAULT 0,
    "HasarsizTeslim" INTEGER NOT NULL DEFAULT 0,
    "MusteriSikayeti" INTEGER NOT NULL DEFAULT 0,
    "GuncellemeTarihi" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("KargoId") REFERENCES "Kargolar"("Id") ON DELETE CASCADE
);

-- Başlangıç için popüler kargo firmalarını ekleyelim
INSERT INTO "Kargolar" ("FirmaAdi", "HizPuani", "MemnuniyetPuani", "HasarsizlikPuani", "BirimFiyat", "AktifMi") VALUES
('Aras Kargo', 8.5, 7.8, 8.2, 25.50, TRUE),
('Yurtiçi Kargo', 9.0, 8.5, 8.8, 28.00, TRUE),
('MNG Kargo', 8.0, 7.5, 7.8, 22.00, TRUE),
('PTT Kargo', 7.0, 7.2, 8.5, 20.00, TRUE),
('Sürat Kargo', 8.8, 8.0, 8.0, 26.50, TRUE);

-- Test için bazı illeri ekleyelim
INSERT INTO "Iller" ("Id", "IlAdi", "PlakaKodu") VALUES 
(1, 'Ankara', 6),
(2, 'İstanbul', 34),
(3, 'İzmir', 35),
(4, 'Bursa', 16),
(5, 'Antalya', 7)
ON CONFLICT ("Id") DO NOTHING;

-- İllere ait popüler ilçeleri ekleyelim
INSERT INTO "Ilceler" ("Id", "IlceAdi", "IlId") VALUES 
-- Ankara ilçeleri
(1, 'Çankaya', 1),
(2, 'Keçiören', 1),
(3, 'Mamak', 1),
(4, 'Yenimahalle', 1),
-- İstanbul ilçeleri
(5, 'Kadıköy', 2),
(6, 'Beşiktaş', 2),
(7, 'Üsküdar', 2),
(8, 'Bakırköy', 2),
-- İzmir ilçeleri
(9, 'Konak', 3),
(10, 'Karşıyaka', 3),
(11, 'Bornova', 3),
-- Bursa ilçeleri
(12, 'Osmangazi', 4),
(13, 'Nilüfer', 4),
(14, 'Yıldırım', 4),
-- Antalya ilçeleri
(15, 'Muratpaşa', 5),
(16, 'Kepez', 5),
(17, 'Konyaaltı', 5)
ON CONFLICT ("Id") DO NOTHING;

-- Performansı artırmak için index'ler oluşturuyoruz
CREATE INDEX idx_siparisler_durum ON "Siparisler"("Durum");
CREATE INDEX idx_siparisler_tarih ON "Siparisler"("OlusturmaTarihi");
CREATE INDEX idx_kargolar_aktif ON "Kargolar"("AktifMi");
CREATE INDEX idx_ilceler_il ON "Ilceler"("IlId");

-- Sık kullanılan sorgular için view'lar oluşturuyoruz
CREATE VIEW vw_aktif_kargolar AS
SELECT * FROM "Kargolar" WHERE "AktifMi" = TRUE;

CREATE VIEW vw_siparis_detay AS
SELECT 
    s.*,
    k."FirmaAdi" as "KargoFirmaAdi",
    k."BirimFiyat" as "KargoBirimFiyat"
FROM "Siparisler" s
LEFT JOIN "Kargolar" k ON s."SeciliKargoId" = k."Id";

-- Sistem hazır! Artık kullanmaya başlayabilirsiniz.
