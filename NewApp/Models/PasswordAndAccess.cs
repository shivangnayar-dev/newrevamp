using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NewApp.Models
{
    public class PasswordAndAccess
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public string EmailID { get; set; }

        [Required]
        [StringLength(255)]
        public string Password { get; set; }

        [Required]
        public int OrganisationId { get; set; }

        [Required]
        [StringLength(255)]
        public string OrganizationName { get; set; }

        [Required]
        [StringLength(100)]
        public string Level { get; set; }

        [Required]
        [StringLength(255)]
        public string CustomerEmployeeName { get; set; }

        [StringLength(255)]
        public string? LinkedLevel2ForLevel3 { get; set; }

        [Required]
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        [Required]
        [StringLength(255)]
        public string CreatedBy { get; set; }

        [Required]
        [StringLength(3)]
        public string IsLatestTimestamp { get; set; } // Should only contain "yes" or "no"

        public DateTime? DeactivatedDate { get; set; }

        [StringLength(255)]
        public string? DeactivatedBy { get; set; }
    }
}
