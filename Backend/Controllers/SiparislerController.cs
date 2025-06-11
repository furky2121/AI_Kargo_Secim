using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KargoSecimAPI.Data;
using KargoSecimAPI.Models;
using KargoSecimAPI.Services;

namespace KargoSecimAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SiparislerController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IKargoService _kargoService;
        private readonly IAIService _aiService;

        public SiparislerController(ApplicationDbContext context, IKargoService kargoService, IAIService aiService)
        {
            _context = context;
            _kargoService = kargoService;
            _aiService = aiService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetSiparisler()
        {
            var siparisler = await _context.Siparisler
                .Include(s => s.SeciliKargo)
                .Include(s => s.Il)
                .Include(s => s.Ilce)
                .OrderByDescending(s => s.OlusturmaTarihi)
                .Select(s => new
                {
                    s.Id,
                    s.SiparisNo,
                    s.MusteriAdi,
                    s.IlId,
                    s.IlceId,
                    Il = s.Il != null ? s.Il.IlAdi : null,
                    Ilce = s.Ilce != null ? s.Ilce.IlceAdi : null,
                    s.Adres,
                    s.Agirlik,
                    s.Oncelik,
                    s.SeciliKargoId,
                    SeciliKargo = s.SeciliKargo,
                    s.Durum,
                    s.OlusturmaTarihi,
                    s.AITavsiyesi
                })
                .ToListAsync();

            return Ok(siparisler);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetSiparis(int id)
        {
            var siparis = await _context.Siparisler
                .Include(s => s.SeciliKargo)
                .Include(s => s.Il)
                .Include(s => s.Ilce)
                .Where(s => s.Id == id)
                .Select(s => new
                {
                    s.Id,
                    s.SiparisNo,
                    s.MusteriAdi,
                    s.IlId,
                    s.IlceId,
                    Il = s.Il != null ? s.Il.IlAdi : null,
                    Ilce = s.Ilce != null ? s.Ilce.IlceAdi : null,
                    s.Adres,
                    s.Agirlik,
                    s.Oncelik,
                    s.SeciliKargoId,
                    SeciliKargo = s.SeciliKargo,
                    s.Durum,
                    s.OlusturmaTarihi,
                    s.AITavsiyesi
                })
                .FirstOrDefaultAsync();

            if (siparis == null)
                return NotFound();

            return Ok(siparis);
        }

        [HttpPost]
        public async Task<ActionResult<Siparis>> PostSiparis(Siparis siparis)
        {
            siparis.OlusturmaTarihi = DateTime.UtcNow;
            siparis.SiparisNo = GenerateSiparisNo();
            
            _context.Siparisler.Add(siparis);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSiparis), new { id = siparis.Id }, siparis);
        }

        [HttpPost("{id}/kargo-sec")]
        public async Task<ActionResult<Siparis>> KargoSec(int id)
        {
            var siparis = await _context.Siparisler.FindAsync(id);
            if (siparis == null)
                return NotFound();

            var kargolar = await _kargoService.GetAllKargolarAsync();
            var secilenKargo = await _aiService.EnUygunKargoyuSecAsync(siparis, kargolar);

            if (secilenKargo == null)
                return BadRequest("Hiç kargo firması bulamadım.");

            siparis.SeciliKargoId = secilenKargo.Id;
            siparis.Durum = "Kargo Atandı";
            siparis.AITavsiyesi = _aiService.AITavsiyesiOlustur(siparis, secilenKargo, kargolar);

            await _context.SaveChangesAsync();

            return Ok(new { siparis, secilenKargo });
        }

        [HttpPut("{id}/durum")]
        public async Task<IActionResult> DurumGuncelle(int id, [FromBody] string yeniDurum)
        {
            var siparis = await _context.Siparisler.FindAsync(id);
            if (siparis == null)
                return NotFound();

            siparis.Durum = yeniDurum;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("istatistikler")]
        public async Task<ActionResult> GetIstatistikler()
        {
            var toplamSiparis = await _context.Siparisler.CountAsync();
            var bekleyenSiparis = await _context.Siparisler.CountAsync(s => s.Durum == "Bekliyor");
            var teslimEdilen = await _context.Siparisler.CountAsync(s => s.Durum == "Teslim Edildi");
            
            var kargoKullanim = await _context.Siparisler
                .Where(s => s.SeciliKargoId != null)
                .GroupBy(s => s.SeciliKargo!.FirmaAdi)
                .Select(g => new { KargoAdi = g.Key, Adet = g.Count() })
                .ToListAsync();

            return Ok(new
            {
                toplamSiparis,
                bekleyenSiparis,
                teslimEdilen,
                kargoKullanim
            });
        }

        private string GenerateSiparisNo()
        {
            return $"SIP{DateTime.Now:yyyyMMddHHmmss}{new Random().Next(1000, 9999)}";
        }
    }
}
