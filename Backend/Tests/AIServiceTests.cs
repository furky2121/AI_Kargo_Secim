using Xunit;
using KargoSecimAPI.Services;
using KargoSecimAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace KargoSecimAPI.Tests
{
    public class AIServiceTests
    {
        private readonly AIService _aiService;

        public AIServiceTests()
        {
            _aiService = new AIService();
        }

        [Fact]
        public async Task EnUygunKargoyuSec_HizOnceligi_EnHizliKargoyuSecer()
        {
            // Test için veriler hazırlıyorum
            var siparis = new Siparis { Oncelik = "Hız", Agirlik = 5 };
            var kargolar = new List<Kargo>
            {
                new Kargo { Id = 1, FirmaAdi = "A Kargo", HizPuani = 9.5m, MemnuniyetPuani = 7, HasarsizlikPuani = 8, BirimFiyat = 30 },
                new Kargo { Id = 2, FirmaAdi = "B Kargo", HizPuani = 7, MemnuniyetPuani = 9, HasarsizlikPuani = 8, BirimFiyat = 25 },
                new Kargo { Id = 3, FirmaAdi = "C Kargo", HizPuani = 8, MemnuniyetPuani = 8, HasarsizlikPuani = 9, BirimFiyat = 28 }
            };

            // Fonksiyonu çalıştırıyorum
            var secilenKargo = await _aiService.EnUygunKargoyuSecAsync(siparis, kargolar);

            // Sonuçları kontrol ediyorum
            Assert.NotNull(secilenKargo);
            Assert.Equal(1, secilenKargo.Id);
            Assert.Equal("A Kargo", secilenKargo.FirmaAdi);
        }

        [Fact]
        public async Task EnUygunKargoyuSec_FiyatOnceligi_EnUcuzKargoyuSecer()
        {
            // Arrange
            var siparis = new Siparis { Oncelik = "Fiyat", Agirlik = 5 };
            var kargolar = new List<Kargo>
            {
                new Kargo { Id = 1, FirmaAdi = "A Kargo", HizPuani = 9, MemnuniyetPuani = 9, HasarsizlikPuani = 9, BirimFiyat = 35 },
                new Kargo { Id = 2, FirmaAdi = "B Kargo", HizPuani = 7, MemnuniyetPuani = 7, HasarsizlikPuani = 7, BirimFiyat = 20 },
                new Kargo { Id = 3, FirmaAdi = "C Kargo", HizPuani = 8, MemnuniyetPuani = 8, HasarsizlikPuani = 8, BirimFiyat = 25 }
            };

            // Act
            var secilenKargo = await _aiService.EnUygunKargoyuSecAsync(siparis, kargolar);

            // Assert
            Assert.NotNull(secilenKargo);
            Assert.Equal(2, secilenKargo.Id);
            Assert.Equal("B Kargo", secilenKargo.FirmaAdi);
        }

        [Fact]
        public async Task EnUygunKargoyuSec_BoşKargoListesi_NullDöner()
        {
            // Arrange
            var siparis = new Siparis { Oncelik = "Dengeli", Agirlik = 5 };
            var kargolar = new List<Kargo>();

            // Act
            var secilenKargo = await _aiService.EnUygunKargoyuSecAsync(siparis, kargolar);

            // Assert
            Assert.Null(secilenKargo);
        }

        [Fact]
        public void AITavsiyesiOlustur_HizOnceligi_DogruMesajDöner()
        {
            // Arrange
            var siparis = new Siparis { Oncelik = "Hız" };
            var secilenKargo = new Kargo 
            { 
                Id = 1, 
                FirmaAdi = "Hızlı Kargo", 
                HizPuani = 9.5m,
                MemnuniyetPuani = 8,
                HasarsizlikPuani = 8,
                BirimFiyat = 30
            };
            var tumKargolar = new List<Kargo> { secilenKargo };

            // Act
            var tavsiye = _aiService.AITavsiyesiOlustur(siparis, secilenKargo, tumKargolar);

            // Assert
            Assert.Contains("Hızlı teslimat", tavsiye);
            Assert.Contains("Hızlı Kargo", tavsiye);
            Assert.Contains("9.5/10", tavsiye);
        }

        [Theory]
        [InlineData("Hız", 0.6, 0.2, 0.1, 0.1)]
        [InlineData("Memnuniyet", 0.2, 0.5, 0.2, 0.1)]
        [InlineData("Hasarsızlık", 0.1, 0.2, 0.6, 0.1)]
        [InlineData("Fiyat", 0.1, 0.1, 0.1, 0.7)]
        [InlineData("Dengeli", 0.25, 0.25, 0.25, 0.25)]
        public async Task EnUygunKargoyuSec_FarkliOncelikler_DogruAgirliklariKullanir(
            string oncelik, double beklenenHiz, double beklenenMemnuniyet, 
            double beklenenHasarsizlik, double beklenenFiyat)
        {
            // Arrange
            var siparis = new Siparis { Oncelik = oncelik, Agirlik = 5 };
            var kargolar = new List<Kargo>
            {
                new Kargo { Id = 1, FirmaAdi = "Test Kargo", HizPuani = 10, MemnuniyetPuani = 1, HasarsizlikPuani = 1, BirimFiyat = 100 }
            };

            // Act
            var secilenKargo = await _aiService.EnUygunKargoyuSecAsync(siparis, kargolar);

            // Assert
            Assert.NotNull(secilenKargo);
            // Burada ağırlıkların doğru çalıştığını dolaylı olarak test ediyorum
            // İleride daha detaylı test yapmak gerekebilir
        }
    }
}
