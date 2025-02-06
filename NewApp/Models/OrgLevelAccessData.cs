using System;

namespace NewApp.Models
{
    public class OrgLevelAccessData
    {
        public int OrgLevelAccess1Id { get; set; }    // Primary Key
        public int OrganizationId { get; set; }

        // Core Access Level Details
        public string AccessEmail_Core { get; set; }
        public string AccessEmail1 { get; set; }
        public string AccessEmail2 { get; set; }
        public string AccessEmail3 { get; set; }
        public string AccessEmail4 { get; set; }
        public string AccessEmail5 { get; set; }
        public string AccessEmail6 { get; set; }
        public string Levels_Core { get; set; }
        public string Enabled_Core { get; set; }
        public string Startdate_Core { get; set; }
        public string Enddate_Core { get; set; }
        public string Username_Core { get; set; }

        // Email Level 1 Details
        public string Levels_Email1 { get; set; }
        public string Enabled_Email1 { get; set; }
        public string Startdate_Email1 { get; set; }
        public string Enddate_Email1 { get; set; }
        public string Username_Email1 { get; set; }

        // Email Level 2 Details
        public string Levels_Email2 { get; set; }
        public string Enabled_Email2 { get; set; }
        public string Startdate_Email2 { get; set; }
        public string Enddate_Email2 { get; set; }
        public string Username_Email2 { get; set; }

        // Email Level 3 Details
        public string Levels_Email3 { get; set; }
        public string Enabled_Email3 { get; set; }
        public string Startdate_Email3 { get; set; }
        public string Enddate_Email3 { get; set; }
        public string Username_Email3 { get; set; }

        // Email Level 4 Details
        public string Levels_Email4 { get; set; }
        public string Enabled_Email4 { get; set; }
        public string Startdate_Email4 { get; set; }
        public string Enddate_Email4 { get; set; }
        public string Username_Email4 { get; set; }

        // Email Level 5 Details
        public string Levels_Email5 { get; set; }
        public string Enabled_Email5 { get; set; }
        public string Startdate_Email5 { get; set; }
        public string Enddate_Email5 { get; set; }
        public string Username_Email5 { get; set; }

        // Email Level 6 Details
        public string Levels_Email6 { get; set; }
        public string Enabled_Email6 { get; set; }
        public string Startdate_Email6 { get; set; }
        public string Enddate_Email6 { get; set; }
        public string Username_Email6 { get; set; }

        // Audit Fields
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }
    }
}
