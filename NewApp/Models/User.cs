using System;
using System.ComponentModel.DataAnnotations;

namespace NewApp.Models
{
    public class User
    {

        [Key]
        public int Id { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }

      // This attribute ensures the mobile number format is validated
        public string Mobile { get; set; } = "0";

       // Assuming Aadhaar number is 12 digits
        public string Adhar { get; set; } = "0";
    }
}

