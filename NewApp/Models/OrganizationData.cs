using System;

namespace NewApp.Models
{
    public class OrganizationData
    {
        public int OrganizationId { get; set; }
        public string OrganizationName { get; set; }
        public string CG_SuperAdminEmailId { get; set; }
        public string Customer_SuperAdminEmailId { get; set; }
        public string Customer_AdminEmailId1 { get; set; }
        public string Customer_AdminEmailId2 { get; set; }
        public string Customer_AdminEmailId3 { get; set; }
        public string Customer_AdminEmailId4 { get; set; }
        public string Customer_AdminEmailId5 { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }

        // Updated to match the table column name exactly
        public string organization_type { get; set; }

        // Also matches the table name exactly
        public string registration_number { get; set; }
    }
}
