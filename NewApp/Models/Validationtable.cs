using System;

namespace NewApp.Models
{
    public class Validationtable
    {
        public int id { get; set; }  // Primary Key, auto-incremented (as per your database schema)
        public int candidateid { get; set; }  // Candidate ID (maps to candidateid in database)

        public bool login_page { get; set; }  // Validation status for the login page
        public bool register_page { get; set; }  // Validation status for the registration page
        public bool info_page { get; set; }  // Validation status for the information page
        public bool candidateinfo_page { get; set; }  // Validation status for the candidate information page
        public string teststatus { get; set; } = string.Empty;  // Status of the test
        public DateTime timestamp { get; set; } = DateTime.UtcNow;  // Timestamp when the record was created or updated
        public string testcode { get; set; } = string.Empty;  // Test code
        public string organisation { get; set; } = string.Empty;  // Organisation name
        public string Name_Report { get; set; } = string.Empty;  // Name of the report
        public string name { get; set; } = string.Empty;  // Candidate name
        public string Screen1 { get; set; } = string.Empty;  // Screen 1 information
        public string Screen2 { get; set; } = string.Empty;  // Screen 2 information
        public string Screen3 { get; set; } = string.Empty;  // Screen 3 information
        public string test_section_1 { get; set; } = string.Empty;  // Test section 1 status
        public string test_section_2 { get; set; } = string.Empty;  // Test section 2 status
        public string test_section_3 { get; set; } = string.Empty;  // Test section 3 status
        public string test_section_4 { get; set; } = string.Empty;  // Test section 4 status
        public string test_section_5 { get; set; } = string.Empty;

    }
}
