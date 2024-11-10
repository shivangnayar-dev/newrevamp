using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NewApp.Models;
using System.Security.Claims;

namespace NewApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScreenInfoController : ControllerBase
    {
        private readonly CandidateDbContext _context;

        public ScreenInfoController(CandidateDbContext context)
        {
            _context = context;
        }

        // GET: api/ScreenInfo/get?testcode=yourTestCode
        [Authorize]
        [HttpGet("get")]
        public IActionResult GetScreenInfo([FromQuery] string testcode)
        {
            if (string.IsNullOrEmpty(testcode))
            {
                return BadRequest("Test code is required.");
            }

            // Fetch screen info for this test code
            var screenInfo = _context.TestInfo.FirstOrDefault(ti => ti.TestCode == testcode);
            if (screenInfo == null)
            {
                return NotFound("Screen information not found for the provided test code.");
            }

            // Return screen1 and screen2 data
            return Ok(new
            {
                screen1 = screenInfo.Screen1,
                screen2 = screenInfo.Screen2
            });
        }

        // POST: api/ScreenInfo/save
        [Authorize]
        [HttpPost("save")]
        public IActionResult SaveScreenInfo([FromBody] TestInfo screenData)
        {
            if (screenData == null || string.IsNullOrEmpty(screenData.TestCode))
            {
                return BadRequest("Test code and screen data are required.");
            }

            // Retrieve the test info for this test code
            var existingInfo = _context.TestInfo.FirstOrDefault(ti => ti.TestCode == screenData.TestCode);
            if (existingInfo == null)
            {
                // Test code not found, create a new entry
                _context.TestInfo.Add(screenData);
            }
            else
            {
                // Update only screen1 and screen2 fields that are not null in the incoming data
                if (!string.IsNullOrEmpty(screenData.Screen1)) existingInfo.Screen1 = screenData.Screen1;
                if (!string.IsNullOrEmpty(screenData.Screen2)) existingInfo.Screen2 = screenData.Screen2;
            }

            _context.SaveChanges();
            return Ok("Screen information saved successfully.");
        }

    }
}
