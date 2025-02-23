using System;
using Microsoft.AspNetCore.Mvc;
using NewApp.Models;
using System.Linq;

namespace NewApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly CandidateDbContext _contextt;

        public AuthController(CandidateDbContext contextt)
        {
            _contextt = contextt;
        }

        // ✅ Step 1: Authenticate User via POST Request
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            try
            {
                Console.WriteLine($"[DEBUG] Attempting login for Email: {request.Email}");

                if (_contextt == null || _contextt.PasswordAndAccess == null)
                {
                    Console.WriteLine("[ERROR] Database context or PasswordAndAccess table is NULL.");
                    return StatusCode(500, "Database context is not initialized.");
                }

                // ✅ Query database for user credentials
                var dbUser = _contextt.PasswordAndAccess
                    .FirstOrDefault(u => u.EmailID == request.Email && u.Password == request.Password);

                if (dbUser != null)
                {
                    Console.WriteLine($"[SUCCESS] User found: {dbUser.EmailID}, OrganisationId: {dbUser.OrganisationId}");

                    return Ok(new
                    {
                        Email = dbUser.EmailID,
                        OrganisationId = dbUser.OrganisationId, // ✅ Return Organisation ID
                        UserLevel = dbUser.Level // ✅ Return User Level
                    });
                }

                Console.WriteLine("[ERROR] Invalid credentials - No matching user found.");
                return Unauthorized("Invalid username or password.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[EXCEPTION] {ex.Message}");
                return StatusCode(500, "An internal server error occurred.");
            }
        }

        // ✅ Step 2: Fetch User Level via GET Request (Email from Headers)
        [HttpGet("get-user-level")]
        public IActionResult GetUserLevel([FromQuery] string email)
        {
            try
            {
                Console.WriteLine($"[DEBUG] Fetching user level for: {email}");

                if (string.IsNullOrEmpty(email))
                {
                    Console.WriteLine("[ERROR] No email provided.");
                    return BadRequest("Email parameter is required.");
                }

                // ✅ Query the database for the user's level
                var dbUser = _contextt.PasswordAndAccess
                    .FirstOrDefault(u => u.EmailID == email);

                if (dbUser != null)
                {
                    Console.WriteLine($"[SUCCESS] Found User Level: {dbUser.Level}");
                    return Ok(new { UserLevel = dbUser.Level });
                }

                Console.WriteLine("[ERROR] User not found in the database.");
                return NotFound("User not found.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[EXCEPTION] {ex.Message}");
                return StatusCode(500, "An internal server error occurred.");
            }
        }


        // ✅ Request model for Login API
        public class LoginRequest
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }
    }
}
