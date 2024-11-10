using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using NewApp.Models;
using Newtonsoft.Json;
using BCrypt.Net;
namespace NewApp.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly UserDbContext _context;

        public AuthController(IConfiguration configuration, UserDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] User user)
        {
            if (_context.User.Any(u => u.Email == user.Email))
            {
                return BadRequest("User already exists.");
            }

            // Hash the password before saving the user
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);

            // Add the user to the database
            _context.User.Add(user);
            _context.SaveChanges();

            // Generate JWT token after registration
            var token = GenerateJwtToken(user.Id, user.Email);

            // Save the generated token to the database
            var userToken = new UserToken
            {
                UserId = user.Id,
                Token = token,
                ExpiryDate = DateTime.UtcNow.AddMinutes(double.Parse(_configuration["Jwt:ExpiryDuration"])) // Set token expiry
            };

            // Save the token in the UserToken table
            _context.UserToken.Add(userToken);
            _context.SaveChanges();

            // Return the token in the response
            return Ok(new { Message = "User registered successfully.", Token = token });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] User user)
        {
            var existingUser = _context.User.FirstOrDefault(u => u.Email == user.Email);
            if (existingUser != null && BCrypt.Net.BCrypt.Verify(user.PasswordHash, existingUser.PasswordHash))
            {
                // Pass both user ID and email to GenerateJwtToken
                var token = GenerateJwtToken(existingUser.Id, existingUser.Email);

                // Save the token in the database
                var userToken = new UserToken
                {
                    UserId = existingUser.Id,
                    Token = token,
                    ExpiryDate = DateTime.UtcNow.AddMinutes(double.Parse(_configuration["Jwt:ExpiryDuration"]))
                };

                _context.UserToken.Add(userToken);
                _context.SaveChanges();

                // Check if CandidateInfo exists
                var candidateInfo = _context.CandidateInfo.FirstOrDefault(ci => ci.UserId == existingUser.Id);
                if (candidateInfo == null)
                {
                    return Ok(new { Token = token, ProfileStatus = "Incomplete" });
                }

                return Ok(new { Token = token, ProfileStatus = "Complete" });
            }

            return Unauthorized("Invalid credentials.");
        }

        private string GenerateJwtToken(int userId, string email)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()), // Include User ID as a claim
            new Claim(ClaimTypes.Email, email), // Add email claim
            new Claim(JwtRegisteredClaimNames.Aud, jwtSettings["Audience"]), // Add audience claim
            new Claim(JwtRegisteredClaimNames.Iss, jwtSettings["Issuer"]) // Add issuer claim
        }),
                Expires = DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["ExpiryDuration"])),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

    }
}



