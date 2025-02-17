using System;

namespace NewApp.Models
{
    public class OrgLevelAccessData
    {
        public int OrgLevelAccess1Id { get; set; }    // Primary Key
        public int OrganizationId { get; set; }
        public string OrganizationName { get; set; }
        public string Email { get; set; }
        public string Level { get; set; }
        public string CustomerEmployeeName { get; set; }
        public string LinkedLevel2ForLevel3 { get; set; }

        // Audit Fields
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }
    }
}
