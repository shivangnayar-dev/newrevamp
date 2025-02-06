using System;

namespace NewApp.Models
{
    public class InvoiceData
    {
        public Guid InvoiceGUID { get; set; }
        public int OrganizationId { get; set; }
        public string ReportId { get; set; }
        public string CodeOfReport { get; set; }
        public int CountOfTest { get; set; }
        public int CountOfReports { get; set; }
        public decimal TotalCost { get; set; }
        public decimal SumOfCost { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public string Status { get; set; }
        public decimal DiscountAmount { get; set; }
    }
}
