using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KargoSecimAPI.Data;
using KargoSecimAPI.Models;

namespace KargoSecimAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IlIlceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public IlIlceController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("iller")]
        public async Task<ActionResult<IEnumerable<Il>>> GetIller()
        {
            return await _context.Iller.OrderBy(i => i.IlAdi).ToListAsync();
        }

        [HttpGet("ilceler/{ilId}")]
        public async Task<ActionResult<IEnumerable<Ilce>>> GetIlcelerByIl(int ilId)
        {
            return await _context.Ilceler
                .Where(ilce => ilce.IlId == ilId)
                .OrderBy(ilce => ilce.IlceAdi)
                .ToListAsync();
        }
    }
}
