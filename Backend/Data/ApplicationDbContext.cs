using Microsoft.EntityFrameworkCore;
using KargoSecimAPI.Models;

namespace KargoSecimAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Kargo> Kargolar { get; set; }
        public DbSet<Siparis> Siparisler { get; set; }
        public DbSet<KargoPerformans> KargoPerformanslari { get; set; }
        public DbSet<Il> Iller { get; set; }
        public DbSet<Ilce> Ilceler { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Kargo tablosu yapılandırması
            modelBuilder.Entity<Kargo>()
                .Property(k => k.BirimFiyat)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Kargo>()
                .Property(k => k.HizPuani)
                .HasPrecision(3, 1);

            modelBuilder.Entity<Kargo>()
                .Property(k => k.MemnuniyetPuani)
                .HasPrecision(3, 1);

            modelBuilder.Entity<Kargo>()
                .Property(k => k.HasarsizlikPuani)
                .HasPrecision(3, 1);

            // Siparis tablosu yapılandırması
            modelBuilder.Entity<Siparis>()
                .Property(s => s.Agirlik)
                .HasPrecision(10, 2);

            // İlişkiler
            modelBuilder.Entity<Siparis>()
                .HasOne(s => s.SeciliKargo)
                .WithMany()
                .HasForeignKey(s => s.SeciliKargoId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<KargoPerformans>()
                .HasOne(kp => kp.Kargo)
                .WithMany()
                .HasForeignKey(kp => kp.KargoId)
                .OnDelete(DeleteBehavior.Cascade);

            // Varsayılan veriler
            modelBuilder.Entity<Kargo>().HasData(
                new Kargo { Id = 1, FirmaAdi = "Aras Kargo", HizPuani = 8.5m, MemnuniyetPuani = 7.8m, HasarsizlikPuani = 8.2m, BirimFiyat = 25.50m, AktifMi = true, OlusturmaTarihi = DateTime.UtcNow },
                new Kargo { Id = 2, FirmaAdi = "Yurtiçi Kargo", HizPuani = 9.0m, MemnuniyetPuani = 8.5m, HasarsizlikPuani = 8.8m, BirimFiyat = 28.00m, AktifMi = true, OlusturmaTarihi = DateTime.UtcNow },
                new Kargo { Id = 3, FirmaAdi = "MNG Kargo", HizPuani = 8.0m, MemnuniyetPuani = 7.5m, HasarsizlikPuani = 7.8m, BirimFiyat = 22.00m, AktifMi = true, OlusturmaTarihi = DateTime.UtcNow },
                new Kargo { Id = 4, FirmaAdi = "PTT Kargo", HizPuani = 7.0m, MemnuniyetPuani = 7.2m, HasarsizlikPuani = 8.5m, BirimFiyat = 20.00m, AktifMi = true, OlusturmaTarihi = DateTime.UtcNow },
                new Kargo { Id = 5, FirmaAdi = "Sürat Kargo", HizPuani = 8.8m, MemnuniyetPuani = 8.0m, HasarsizlikPuani = 8.0m, BirimFiyat = 26.50m, AktifMi = true, OlusturmaTarihi = DateTime.UtcNow }
            );

            // İl ve İlçe verileri
            modelBuilder.Entity<Il>().HasData(
                new Il { Id = 1, IlAdi = "Ankara" },
                new Il { Id = 2, IlAdi = "İstanbul" },
                new Il { Id = 3, IlAdi = "İzmir" },
                new Il { Id = 4, IlAdi = "Bursa" },
                new Il { Id = 5, IlAdi = "Antalya" }
            );

            modelBuilder.Entity<Ilce>().HasData(
                // Ankara
                new Ilce { Id = 1, IlceAdi = "Çankaya", IlId = 1 },
                new Ilce { Id = 2, IlceAdi = "Keçiören", IlId = 1 },
                new Ilce { Id = 3, IlceAdi = "Mamak", IlId = 1 },
                new Ilce { Id = 4, IlceAdi = "Yenimahalle", IlId = 1 },
                // İstanbul
                new Ilce { Id = 5, IlceAdi = "Kadıköy", IlId = 2 },
                new Ilce { Id = 6, IlceAdi = "Beşiktaş", IlId = 2 },
                new Ilce { Id = 7, IlceAdi = "Üsküdar", IlId = 2 },
                new Ilce { Id = 8, IlceAdi = "Bakırköy", IlId = 2 },
                // İzmir
                new Ilce { Id = 9, IlceAdi = "Konak", IlId = 3 },
                new Ilce { Id = 10, IlceAdi = "Karşıyaka", IlId = 3 },
                new Ilce { Id = 11, IlceAdi = "Bornova", IlId = 3 },
                // Bursa
                new Ilce { Id = 12, IlceAdi = "Osmangazi", IlId = 4 },
                new Ilce { Id = 13, IlceAdi = "Nilüfer", IlId = 4 },
                new Ilce { Id = 14, IlceAdi = "Yıldırım", IlId = 4 },
                // Antalya
                new Ilce { Id = 15, IlceAdi = "Muratpaşa", IlId = 5 },
                new Ilce { Id = 16, IlceAdi = "Kepez", IlId = 5 },
                new Ilce { Id = 17, IlceAdi = "Konyaaltı", IlId = 5 }
            );
        }
    }
}
