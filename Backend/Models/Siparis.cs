namespace KargoSecimAPI.Models
{
    public class Siparis
    {
        public int Id { get; set; }
        public string SiparisNo { get; set; } = string.Empty;
        public string MusteriAdi { get; set; } = string.Empty;
        public int IlId { get; set; }
        public int IlceId { get; set; }
        public string Adres { get; set; } = string.Empty;
        public decimal Agirlik { get; set; }
        public string Oncelik { get; set; } = "Dengeli"; // Hız, Memnuniyet, Hasarsızlık, Fiyat, Dengeli
        public int? SeciliKargoId { get; set; }
        public Kargo? SeciliKargo { get; set; }
        public string Durum { get; set; } = "Kargo Atandı";
        public DateTime OlusturmaTarihi { get; set; }
        public string? AITavsiyesi { get; set; }
        
        // Navigation properties
        public Il? Il { get; set; }
        public Ilce? Ilce { get; set; }
    }
}
