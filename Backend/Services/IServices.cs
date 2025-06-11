using KargoSecimAPI.Models;

namespace KargoSecimAPI.Services
{
    public interface IKargoService
    {
        Task<List<Kargo>> GetAllKargolarAsync();
        Task<Kargo?> GetKargoByIdAsync(int id);
        Task<Kargo> CreateKargoAsync(Kargo kargo);
        Task<Kargo?> UpdateKargoAsync(int id, Kargo kargo);
        Task<bool> DeleteKargoAsync(int id);
    }

    public interface IAIService
    {
        Task<Kargo?> EnUygunKargoyuSecAsync(Siparis siparis, List<Kargo> kargolar);
        string AITavsiyesiOlustur(Siparis siparis, Kargo secilenKargo, List<Kargo> tumKargolar);
    }
}
