using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NewApp.Models;
using System.Security.Claims;

namespace NewApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CandidateInfoController : ControllerBase
    {
        private readonly UserDbContext _context;

        public CandidateInfoController(UserDbContext context)
        {
            _context = context;
        }
        [Authorize]
        [HttpGet("get")]
        public IActionResult GetCandidateInfo()
        {
            // Extract user ID from JWT claims
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("User not authenticated.");
            }

            // Fetch candidate info for this user
            var candidateInfo = _context.CandidateInfo.FirstOrDefault(ci => ci.UserId == userId);
            if (candidateInfo == null)
            {
                return NotFound("Candidate information not found.");
            }

            return Ok(candidateInfo); // Return the saved information
        }

        [Authorize]
        [HttpPost("save")]
        public IActionResult SaveCandidateInfo([FromBody] CandidateInfo candidateInfo)
        {
            // Check if candidate information is null
            if (candidateInfo == null)
            {
                return BadRequest("Candidate information cannot be null.");
            }

            // Extract the user ID directly from the JWT claims
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier); // Adjust if your claim type is different
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("User not authenticated.");
            }

            // Check for existing candidate info
            var existingInfo = _context.CandidateInfo.FirstOrDefault(ci => ci.UserId == userId);

            if (existingInfo == null)
            {
                // Set the UserId to the candidate info
                candidateInfo.UserId = userId;
                _context.CandidateInfo.Add(candidateInfo);
            }
            else
            {
                // Update existing candidate info
                existingInfo.FullName = candidateInfo.FullName;
                existingInfo.Country = candidateInfo.Country;
                existingInfo.Location = candidateInfo.Location;
                existingInfo.Gender = candidateInfo.Gender;
                existingInfo.DateOfBirth = candidateInfo.DateOfBirth;
            }
           

            // Save changes to the database
            _context.SaveChanges();
            return Ok("Candidate information saved successfully.");
        }

    }
}
