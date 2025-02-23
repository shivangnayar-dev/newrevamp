using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NewApp.Models
{
    public class OrganizationTestDetails
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int TestCodeId { get; set; }

        [Required]
        public int OrganizationId { get; set; }

        [Required]
        public string OrganizationReportId { get; set; }
        public string TestCode { get; set; }

        public string ConsultantComments { get; set; }

        [MaxLength(255)]
        public string LogoPath { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        
        public string ReportSharingOption { get; set; }

        [Required]
        public bool VideoProctoring { get; set; }

        [Required]
        public bool CandidatePhoneNumberRequired { get; set; }

        [Required]
        public bool FitmentRequired { get; set; }

        public string ExtraQuestion1 { get; set; }
        public string ExtraQuestion2 { get; set; }
        public string ExtraQuestion3 { get; set; }
        public string ExtraQuestion4 { get; set; }
        public string ExtraQuestion5 { get; set; }

        [Required]
       
        public string TestPurpose { get; set; }

        [Required]
        public bool PaymentRequired { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }

        [MaxLength(10)]
        public string Currency { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal DiscountPercentage { get; set; }

   
        public decimal FinalPrice { get; set; }

        [Required]
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedDate { get; set; } = DateTime.UtcNow;

        [MaxLength(100)]
        public string CreatedBy { get; set; }

        [MaxLength(100)]
        public string UpdatedBy { get; set; }
    }
}