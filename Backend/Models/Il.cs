namespace KargoSecimAPI.Models
{
    public class Il
    {
        public int Id { get; set; }
        public string IlAdi { get; set; } = string.Empty;
        public List<Ilce> Ilceler { get; set; } = new List<Ilce>();
    }
}
