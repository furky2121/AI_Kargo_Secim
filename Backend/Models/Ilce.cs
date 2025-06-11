namespace KargoSecimAPI.Models
{
    public class Ilce
    {
        public int Id { get; set; }
        public string IlceAdi { get; set; } = string.Empty;
        public int IlId { get; set; }
        public Il? Il { get; set; }
    }
}
