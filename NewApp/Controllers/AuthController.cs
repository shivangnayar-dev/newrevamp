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
            // Hardcoded credentials for super admin login
            string adminEmail = "score@pexitics.com";
            string adminPassword = "India@123";

            // Check if the input matches the hardcoded credentials
            if (user.Email == adminEmail && user.PasswordHash == adminPassword)
            {
                // Generate JWT token
                var token = GenerateJwtToken(1, adminEmail); // User ID can be arbitrary here since it's hardcoded

                // Return the token in the response without saving it to the database
                return Ok(new { Token = token });
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



