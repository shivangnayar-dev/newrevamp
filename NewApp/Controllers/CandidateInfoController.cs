using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NewApp.Models;
using System.Security.Claims;
using Microsoft.Extensions.Logging;

namespace NewApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CandidateInfoController : ControllerBase
    {
        private readonly UserDbContext _context;
        private readonly CandidateDbContext _candidateContext;
        private readonly ILogger<CandidateInfoController> _logger;

        public CandidateInfoController(UserDbContext context, CandidateDbContext candidateContext, ILogger<CandidateInfoController> logger)
        {
            _context = context;
            _candidateContext = candidateContext;
            _logger = logger;
        }

        [Authorize]
        [HttpGet("get")]
        public IActionResult GetCandidateInfo()
        {
            // Get the authenticated user's ID from the claims
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("User not authenticated.");
            }

            // Fetch CandidateInfo based on the UserId
            var candidateInfo = _context.CandidateInfo.FirstOrDefault(ci => ci.UserId == userId);
            if (candidateInfo == null)
            {
                return NotFound("Candidate information not found.");
            }

            // Assuming UserId is equivalent to CandidateId, return the CandidateId
            var candidateId = candidateInfo.UserId;  // CandidateId is stored in UserId field

            // Return only CandidateId in the response
            return Ok(new { CandidateId = candidateId });
        }


        [Authorize]
        [HttpPost("save")]
        public IActionResult SaveCandidateInfo([FromBody] CandidateInfo candidateInfo)
        {
            if (candidateInfo == null)
            {
                return BadRequest("Candidate information cannot be null.");
            }

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("User not authenticated.");
            }

            // Fetch user data to get email, mobile, and adhar
            var user = _context.User.FirstOrDefault(u => u.Id == userId); // Assuming 'Users' is your DbSet for User model
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Check if CandidateInfo already exists
            var existingInfo = _context.CandidateInfo.FirstOrDefault(ci => ci.UserId == userId);
            // Check if CandidateDetails already exists
            var existingDetails = _candidateContext.Candidates.FirstOrDefault(cd => cd.candidate_id == userId);

            // Save to CandidateInfo
            if (existingInfo == null)
            {
                candidateInfo.UserId = userId;
                _context.CandidateInfo.Add(candidateInfo);
            }
            else
            {
                existingInfo.FullName = candidateInfo.FullName;
                existingInfo.Country = candidateInfo.Country;
                existingInfo.Location = candidateInfo.Location;
                existingInfo.Gender = candidateInfo.Gender;
                existingInfo.DateOfBirth = candidateInfo.DateOfBirth;
            }

            // Save to CandidateDetails
            if (existingDetails == null)
            {
                var newCandidateDetails = new CandidateDetails
                {
                    candidate_id = userId, // Use UserId as candidate_id
                    name = candidateInfo.FullName,
                    gender = candidateInfo.Gender,
                    dob = candidateInfo.DateOfBirth ?? default(DateTime), // Handle nullable DateTime
                    location = candidateInfo.Location,
                    country = candidateInfo.Country,
                    Mobile_No = user.Mobile, // Fetch mobile from User model
                    Adhar_No = user.Adhar,  // Fetch adhar from User model
                    email_address = user.Email, // Fetch email from User model
                    password = "0", // Default or add from candidateInfo if available
                    qualification = "0", // Default or add from candidateInfo if available
                    organization = "0", // Default or add from candidateInfo if available
                    otherOrganization = "0", // Default or add from candidateInfo if available
                    SelectedOptionTimestamps = "0", // Default or add from candidateInfo if available
                    SelectedOptions = "0", // Default or add from candidateInfo if available
                    selectedSpecializations = "0", // Default or add from candidateInfo if available
                    selectedIndustries = "0", // Default or add from candidateInfo if available
                    interest = "0", // Default or add from candidateInfo if available
                    pursuing = "0", // Default or add from candidateInfo if available
                    transactionId = "0", // Default or add from candidateInfo if available
                    rating = 0, // Default or add from candidateInfo if available
                    storedTestCode = "0", // Default or add from candidateInfo if available
                    upiPhoneNumber = "0", // Default or add from candidateInfo if available
                    amountPaid = "0", // Default or add from candidateInfo if available
                    mathScience = "0", // Default or add from candidateInfo if available
                    testProgress = "0", // Default or add from candidateInfo if available
                    mathStats = "0", // Default or add from candidateInfo if available
                    science = "0", // Default or add from candidateInfo if available
                    govJobs = "0", // Default or add from candidateInfo if available
                    armedForcesJobs = "0", // Default or add from candidateInfo if available
                    coreStream = "0", // Default or add from candidateInfo if available
                    academicStream = "0", // Default or add from candidateInfo if available
                    timestamp_start = "0", // Default or add from candidateInfo if available
                    timestamp_end = "0", // Default or add from candidateInfo if available
                    SportsJobs = "0" // Default or add from candidateInfo if available
                };

                _candidateContext.Candidates.Add(newCandidateDetails);
                _candidateContext.SaveChanges(); // Save changes to CandidateDetails
                _logger.LogInformation("Added new CandidateDetails record for userId: " + userId);
            }

            _context.SaveChanges(); // Save changes to CandidateInfo

            return Ok("Candidate information saved successfully.");
        }

        public class SubmitSelectedOptionsRequest
        {
            public string SelectedOptions { get; set; }
        }
    }
}
