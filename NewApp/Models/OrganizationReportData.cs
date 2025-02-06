using System;

namespace NewApp.Models
{
    public class OrganizationReportData
    {
        public int OrganizationReportId { get; set; }  // Primary Key
        public int OrganizationId { get; set; }        // Foreign key for Organization
        public string ReportId { get; set; }           // Report identifier (36 characters)
        public decimal Minimumcostofreport { get; set; }  // Minimum cost of the report
        public decimal MarkuponMinimumcost { get; set; }  // Markup percentage on the minimum cost
        public decimal TotalCost { get; set; }         // Total cost of the report
        public DateTime? Contract_Startdate { get; set; } // Contract start date (nullable)
        public DateTime? Contract_Enddate { get; set; }   // Contract end date (nullable)
        public DateTime CreatedDate { get; set; }       // Date when the record was created
        public string CreatedBy { get; set; }           // User who created the record
        public DateTime? UpdatedDate { get; set; }      // Date when the record was last updated (nullable)
        public string UpdatedBy { get; set; }           // User who last updated the record
    }
}
