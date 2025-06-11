namespace KargoSecimAPI.Models
{
    public class KargoPerformans
    {
        public int Id { get; set; }
        public int KargoId { get; set; }
        public Kargo? Kargo { get; set; }
        public int ToplamGonderi { get; set; }
        public int ZamanindaTeslim { get; set; }
        public int HasarsizTeslim { get; set; }
        public int MusteriSikayeti { get; set; }
        public DateTime GuncellemeTarihi { get; set; }
    }
}
