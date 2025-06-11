using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KargoSecimAPI.Data;
using KargoSecimAPI.Models;
using KargoSecimAPI.Services;

namespace KargoSecimAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KargolarController : ControllerBase
    {
        private readonly IKargoService _kargoService;

        public KargolarController(IKargoService kargoService)
        {
            _kargoService = kargoService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Kargo>>> GetKargolar()
        {
            var kargolar = await _kargoService.GetAllKargolarAsync();
            return Ok(kargolar);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Kargo>> GetKargo(int id)
        {
            var kargo = await _kargoService.GetKargoByIdAsync(id);
            if (kargo == null)
                return NotFound();

            return Ok(kargo);
        }

        [HttpPost]
        public async Task<ActionResult<Kargo>> PostKargo(Kargo kargo)
        {
            var yeniKargo = await _kargoService.CreateKargoAsync(kargo);
            return CreatedAtAction(nameof(GetKargo), new { id = yeniKargo.Id }, yeniKargo);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutKargo(int id, Kargo kargo)
        {
            var guncelKargo = await _kargoService.UpdateKargoAsync(id, kargo);
            if (guncelKargo == null)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKargo(int id)
        {
            var silindi = await _kargoService.DeleteKargoAsync(id);
            if (!silindi)
                return NotFound();

            return NoContent();
        }
    }
}
