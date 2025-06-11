namespace KargoSecimAPI.Models
{
    public class Kargo
    {
        public int Id { get; set; }
        public string FirmaAdi { get; set; } = string.Empty;
        public decimal HizPuani { get; set; } // 1-10 arası
        public decimal MemnuniyetPuani { get; set; } // 1-10 arası
        public decimal HasarsizlikPuani { get; set; } // 1-10 arası
        public decimal BirimFiyat { get; set; }
        public bool AktifMi { get; set; }
        public DateTime OlusturmaTarihi { get; set; }
    }
}
