using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NewApp.Models
{
    public class LevelAccess
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int OrganizationId { get; set; }

        [Required]
        [StringLength(255)]
        public string OrganizationName { get; set; }

        [Required]
        [StringLength(255)]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [StringLength(100)]
        public string Level { get; set; }

        [Required]
        [StringLength(255)]
        public string CustomerEmployeeName { get; set; }

        [StringLength(255)]
        public string? LinkedLevel2ForLevel3 { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        [Required]
        [StringLength(255)]
        public string CreatedBy { get; set; }
    }
}
