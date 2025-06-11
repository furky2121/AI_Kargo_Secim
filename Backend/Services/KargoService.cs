using Microsoft.EntityFrameworkCore;
using KargoSecimAPI.Data;
using KargoSecimAPI.Models;

namespace KargoSecimAPI.Services
{
    public class KargoService : IKargoService
    {
        private readonly ApplicationDbContext _context;

        public KargoService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Kargo>> GetAllKargolarAsync()
        {
            return await _context.Kargolar
                .Where(k => k.AktifMi)
                .OrderBy(k => k.FirmaAdi)
                .ToListAsync();
        }

        public async Task<Kargo?> GetKargoByIdAsync(int id)
        {
            return await _context.Kargolar.FindAsync(id);
        }

        public async Task<Kargo> CreateKargoAsync(Kargo kargo)
        {
            kargo.OlusturmaTarihi = DateTime.UtcNow;
            _context.Kargolar.Add(kargo);
            await _context.SaveChangesAsync();
            return kargo;
        }

        public async Task<Kargo?> UpdateKargoAsync(int id, Kargo kargo)
        {
            var mevcutKargo = await _context.Kargolar.FindAsync(id);
            if (mevcutKargo == null)
                return null;

            mevcutKargo.FirmaAdi = kargo.FirmaAdi;
            mevcutKargo.HizPuani = kargo.HizPuani;
            mevcutKargo.MemnuniyetPuani = kargo.MemnuniyetPuani;
            mevcutKargo.HasarsizlikPuani = kargo.HasarsizlikPuani;
            mevcutKargo.BirimFiyat = kargo.BirimFiyat;
            mevcutKargo.AktifMi = kargo.AktifMi;

            await _context.SaveChangesAsync();
            return mevcutKargo;
        }

        public async Task<bool> DeleteKargoAsync(int id)
        {
            var kargo = await _context.Kargolar.FindAsync(id);
            if (kargo == null)
                return false;

            kargo.AktifMi = false; // Soft delete
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
