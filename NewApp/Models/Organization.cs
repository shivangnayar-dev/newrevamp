using System;

namespace NewApp.Models
{
    public class Organization
    {
        public int OrganizationId { get; set; }
        public string OrganizationName { get; set; }
        public string CG_SuperAdminEmailId { get; set; }
        public string Customer_SuperAdminEmailId { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public string organization_type { get; set; }
        public string registration_number { get; set; }
    }
}
