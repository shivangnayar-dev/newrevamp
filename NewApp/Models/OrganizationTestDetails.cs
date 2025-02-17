using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NewApp.Models
{
    public class OrganizationTestDetails
    {
        [Key]
        public int TestCodeId { get; set; }  // Unique Test Code ID (Primary Key)

        [Required]
        public int OrganizationId { get; set; }  // Foreign Key - Organization

        [Required]
        public int OrganizationReportId { get; set; }  // Foreign Key - Report Data

        public string ConsultantComments { get; set; }  // Comments about the test

        public string LogoPath { get; set; }  // Path for uploaded logo

        [Required]
        public DateTime StartDate { get; set; } = DateTime.Now;  // Start Date

        public DateTime? EndDate { get; set; }  // End Date (nullable)

        [Required]
        public string ReportSharingOption { get; set; }  // "realtime", "scheduled", "no"

        public bool VideoProctoring { get; set; } = false;  // Video monitoring feature

        public bool CandidatePhoneNumberRequired { get; set; } = false;  // Is phone number required?

        public bool FitmentRequired { get; set; } = false;  // Is Fitment required?

        public string ExtraQuestion1 { get; set; }  // Extra free-text question 1
        public string ExtraQuestion2 { get; set; }  // Extra free-text question 2
        public string ExtraQuestion3 { get; set; }  // Extra free-text question 3
        public string ExtraQuestion4 { get; set; }  // Extra free-text question 4
        public string ExtraQuestion5 { get; set; }  // Extra free-text question 5

        [Required]
        public string TestPurpose { get; set; }  // "CareerGuidance", "Hiring", "Testing", "Others"

        public bool PaymentRequired { get; set; } = false;  // Is Payment Required?

        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; } = 0.00m;  // Cost of the test

        [StringLength(10)]
        public string Currency { get; set; } = "USD";  // Currency (USD, INR, EUR, etc.)

        [Column(TypeName = "decimal(5,2)")]
        public decimal DiscountPercentage { get; set; } = 0.00m;  // Discount in %

        [NotMapped]
        public decimal FinalPrice => Price - (Price * DiscountPercentage / 100);  // Auto-calculated Final Price

        public DateTime CreatedDate { get; set; } = DateTime.Now;  // Created Timestamp

        public DateTime? UpdatedDate { get; set; }  // Last Updated Timestamp

        [StringLength(100)]
        public string CreatedBy { get; set; } = "Admin";  // Created By

        [StringLength(100)]
        public string UpdatedBy { get; set; } = "Admin";  // Updated By
    }
}