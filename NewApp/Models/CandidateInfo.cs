using System;
using System.ComponentModel.DataAnnotations;

namespace NewApp.Models
{
    public class CandidateInfo
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; } // The ID to link the information to a specific user

        public string FullName { get; set; } // Default to empty string

   
        public string Country { get; set; } // Default to empty string

   
        public string Location { get; set; } // Default to empty string


        public string Gender { get; set; }  // Default to empty string

        public DateTime? DateOfBirth { get; set; } // Default is null, as DateTime? is nullable
   
}
}
