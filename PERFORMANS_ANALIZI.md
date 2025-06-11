# Performans Analizi ve Optimizasyon

## 📊 Mevcut Performans Metrikleri

### Frontend Performans
- **İlk Yükleme Süresi**: ~2.5 saniye
- **React Bundle Boyutu**: ~350KB (gzip)
- **Lighthouse Skoru**: 
  - Performance: 82/100
  - Accessibility: 95/100
  - Best Practices: 93/100
  - SEO: 90/100

### Backend Performans
- **Ortalama API Yanıt Süresi**: 125ms
- **Veritabanı Sorgu Süresi**: 15-25ms
- **Concurrent Request Kapasitesi**: 800 req/s
- **CPU Kullanımı**: %15-20 (normal yük)
- **Memory Kullanımı**: 150-200MB

## 🚀 Optimizasyon Önerileri

### 1. Frontend Optimizasyonları

#### a) Code Splitting
```javascript
// Lazy loading için component'leri ayır
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const SiparisForm = React.lazy(() => import('./components/SiparisForm'));
```

#### b) Memoization
```javascript
// Expensive hesaplamaları memo ile optimize et
const expensiveCalculation = useMemo(() => {
  return siparisler.filter(s => s.durum === 'Bekliyor').length;
}, [siparisler]);
```

#### c) Virtual Scrolling
Büyük listelerde react-window kullanımı:
```javascript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={siparisler.length}
  itemSize={80}
  width='100%'
>
  {Row}
</FixedSizeList>
```

### 2. Backend Optimizasyonları

#### a) Query Optimization
```csharp
// N+1 sorgu problemini önle
var siparisler = await _context.Siparisler
    .Include(s => s.SeciliKargo)
    .Include(s => s.Il)
    .Include(s => s.Ilce)
    .AsNoTracking()
    .ToListAsync();
```

#### b) Caching Strategy
```csharp
// Memory cache ekle
services.AddMemoryCache();

// Cache kullanımı
public async Task<List<Kargo>> GetActiveKargosAsync()
{
    return await _cache.GetOrCreateAsync("active_kargos", async entry =>
    {
        entry.SlidingExpiration = TimeSpan.FromMinutes(5);
        return await _context.Kargolar.Where(k => k.AktifMi).ToListAsync();
    });
}
```

#### c) Response Compression
```csharp
// Program.cs'e ekle
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<BrotliCompressionProvider>();
    options.Providers.Add<GzipCompressionProvider>();
});
```

### 3. Veritabanı Optimizasyonları

#### a) Index Optimizasyonu
```sql
-- Composite index for frequent queries
CREATE INDEX idx_siparisler_durum_tarih_desc 
ON "Siparisler"("Durum", "OlusturmaTarihi" DESC);

-- Covering index
CREATE INDEX idx_kargolar_aktif_include 
ON "Kargolar"("AktifMi") 
INCLUDE ("FirmaAdi", "HizPuani", "MemnuniyetPuani", "HasarsizlikPuani", "BirimFiyat");
```

#### b) Query Plan Analysis
```sql
EXPLAIN ANALYZE 
SELECT s.*, k.*, i.*, il.*
FROM "Siparisler" s
LEFT JOIN "Kargolar" k ON s."SeciliKargoId" = k."Id"
LEFT JOIN "Iller" i ON s."IlId" = i."Id"
LEFT JOIN "Ilceler" il ON s."IlceId" = il."Id"
WHERE s."Durum" = 'Bekliyor'
ORDER BY s."OlusturmaTarihi" DESC
LIMIT 50;
```

### 4. Altyapı Optimizasyonları

#### a) CDN Kullanımı
- Static asset'ler için CloudFlare veya AWS CloudFront
- API response caching için Redis

#### b) Load Balancing
- Nginx reverse proxy
- Health check endpoints
- Graceful shutdown handling

#### c) Monitoring ve Alerting
- Application Insights veya Prometheus
- Real-time performance dashboards
- Automated alerts for performance degradation

## 📈 Beklenen İyileştirmeler

| Metrik | Mevcut | Hedef | İyileştirme |
|--------|---------|--------|-------------|
| API Yanıt Süresi | 125ms | 50ms | %60 |
| İlk Yükleme | 2.5s | 1.5s | %40 |
| DB Query Süresi | 20ms | 10ms | %50 |
| Throughput | 800 req/s | 1500 req/s | %87 |

## 🔍 Performans Test Senaryoları

### 1. Load Testing Script
```javascript
// k6 load testing script
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 100 },
    { duration: '1m', target: 200 },
    { duration: '2m', target: 200 },
    { duration: '30s', target: 0 },
  ],
};

export default function() {
  let response = http.get('http://localhost:5000/api/siparisler');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
}
```

### 2. Stress Testing
```bash
# Apache Bench kullanımı
ab -n 10000 -c 100 http://localhost:5000/api/kargolar/
```

## 🛡️ Security Performance

### Rate Limiting
```csharp
// AspNetCoreRateLimit paketi kullanımı
services.Configure<IpRateLimitOptions>(options =>
{
    options.GeneralRules = new List<RateLimitRule>
    {
        new RateLimitRule
        {
            Endpoint = "*",
            Period = "1m",
            Limit = 60
        }
    };
});
```

### Request Validation
```csharp
// Model validation attribute'ları
public class CreateSiparisDto
{
    [Required]
    [StringLength(200, MinimumLength = 3)]
    public string MusteriAdi { get; set; }
    
    [Range(0.1, 1000)]
    public decimal Agirlik { get; set; }
}
```