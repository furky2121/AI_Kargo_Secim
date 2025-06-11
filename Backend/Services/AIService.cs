using KargoSecimAPI.Models;
using System.Linq;

namespace KargoSecimAPI.Services
{
    public class AIService : IAIService
    {
        public async Task<Kargo?> EnUygunKargoyuSecAsync(Siparis siparis, List<Kargo> kargolar)
        {
            if (!kargolar.Any())
                return null;

            // Kullanıcının seçtiği önceliğe göre puanlama ağırlıklarını ayarlıyorum
            var agirliklar = siparis.Oncelik switch
            {
                "Hız" => new { Hiz = 0.6, Memnuniyet = 0.2, Hasarsizlik = 0.1, Fiyat = 0.1 },
                "Memnuniyet" => new { Hiz = 0.2, Memnuniyet = 0.5, Hasarsizlik = 0.2, Fiyat = 0.1 },
                "Hasarsızlık" => new { Hiz = 0.1, Memnuniyet = 0.2, Hasarsizlik = 0.6, Fiyat = 0.1 },
                "Fiyat" => new { Hiz = 0.1, Memnuniyet = 0.1, Hasarsizlik = 0.1, Fiyat = 0.7 },
                _ => new { Hiz = 0.25, Memnuniyet = 0.25, Hasarsizlik = 0.25, Fiyat = 0.25 } // Varsayılan olarak dengeli dağıtım yapıyorum
            };

            // En pahalı ve en ucuz kargoyu bulup fiyat puanlaması için kullanacağım
            var maxFiyat = kargolar.Max(k => k.BirimFiyat);
            var minFiyat = kargolar.Min(k => k.BirimFiyat);

            // Her kargo firması için toplam performans puanını hesaplıyorum
            var puanliKargolar = kargolar.Select(k => new
            {
                Kargo = k,
                ToplamPuan = ((double)k.HizPuani / 10 * agirliklar.Hiz) +
                            ((double)k.MemnuniyetPuani / 10 * agirliklar.Memnuniyet) +
                            ((double)k.HasarsizlikPuani / 10 * agirliklar.Hasarsizlik) +
                            ((double)(maxFiyat - k.BirimFiyat) / (double)(maxFiyat - minFiyat) * agirliklar.Fiyat)
            }).OrderByDescending(x => x.ToplamPuan);

            return await Task.FromResult(puanliKargolar.First().Kargo);
        }

        public string AITavsiyesiOlustur(Siparis siparis, Kargo secilenKargo, List<Kargo> tumKargolar)
        {
            var tavsiye = $"🤖 Kargo Seçim Sonucu\n\n";
            
            switch (siparis.Oncelik)
            {
                case "Hız":
                    tavsiye += $"⚡ Hızlı teslimat istediğiniz için {secilenKargo.FirmaAdi} firmasını seçtim.\n\n";
                    tavsiye += $"📊 Hız Skoru: {secilenKargo.HizPuani}/10\n";
                    tavsiye += $"💡 {secilenKargo.FirmaAdi}, mevcut {tumKargolar.Count} firma içinde ";
                    var hizSiralamasi = tumKargolar.OrderByDescending(k => k.HizPuani).ToList();
                    var sira = hizSiralamasi.FindIndex(k => k.Id == secilenKargo.Id) + 1;
                    tavsiye += $"hız bakımından {sira}. sırada.\n";
                    break;
                    
                case "Memnuniyet":
                    tavsiye += $"😊 Müşteri memnuniyeti önceliğinize göre {secilenKargo.FirmaAdi} uygun bulundu.\n\n";
                    tavsiye += $"⭐ Memnuniyet Skoru: {secilenKargo.MemnuniyetPuani}/10\n";
                    tavsiye += $"💡 Müşteriler bu firmadan genelde memnun kalıyor, geri dönüşler olumlu.\n";
                    break;
                    
                case "Hasarsızlık":
                    tavsiye += $"📦 Güvenli taşıma önceliğiniz nedeniyle {secilenKargo.FirmaAdi} seçildi.\n\n";
                    tavsiye += $"🛡️ Güvenlik Skoru: {secilenKargo.HasarsizlikPuani}/10\n";
                    tavsiye += $"💡 Hassas ürünler için güvenle tercih edebileceğiniz bir firma.\n";
                    break;
                    
                case "Fiyat":
                    tavsiye += $"💰 Bütçe dostu seçiminiz için {secilenKargo.FirmaAdi} öneriyorum.\n\n";
                    tavsiye += $"💵 Kargo Ücreti: {secilenKargo.BirimFiyat:C}\n";
                    var enUcuz = tumKargolar.OrderBy(k => k.BirimFiyat).First();
                    if (secilenKargo.Id == enUcuz.Id)
                    {
                        tavsiye += $"💡 {secilenKargo.FirmaAdi} şu an için en ekonomik seçenek.\n";
                    }
                    else
                    {
                        tavsiye += $"💡 En düşük fiyat {enUcuz.FirmaAdi} ({enUcuz.BirimFiyat:C}) firmasında olsa da, ";
                        tavsiye += $"{secilenKargo.FirmaAdi} kalite/fiyat dengesi açısından daha mantıklı.\n";
                    }
                    break;
                    
                default: // Dengeli
                    tavsiye += $"⚖️ Dengeli tercih için {secilenKargo.FirmaAdi} en iyisi.\n\n";
                    tavsiye += $"📊 Firma Performansı:\n";
                    tavsiye += $"   • Hız: {secilenKargo.HizPuani}/10\n";
                    tavsiye += $"   • Memnuniyet: {secilenKargo.MemnuniyetPuani}/10\n";
                    tavsiye += $"   • Güvenlik: {secilenKargo.HasarsizlikPuani}/10\n";
                    tavsiye += $"   • Ücret: {secilenKargo.BirimFiyat:C}\n\n";
                    tavsiye += $"💡 {secilenKargo.FirmaAdi}, tüm kriterlerde iyi performans gösteriyor. ";
                    tavsiye += $"Hem güvenilir hem de makul fiyatlı bir tercih.\n";
                    break;
            }
            
            return tavsiye;
        }
    }
}
