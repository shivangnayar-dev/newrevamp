using System;

namespace NewApp.Models
{
    public class Validationtable
    {
        public int id { get; set; }  // Primary Key, auto-incremented (as per your database schema)
        public int candidateid { get; set; }  // Candidate ID (maps to candidateid in database)

        public bool login_page { get; set; }  // Validation status for the login page (converted to tinyint(1) in MySQL)
        public bool register_page { get; set; }  // Validation status for the registration page (converted to tinyint(1) in MySQL)
        public bool info_page { get; set; }  // Validation status for the information page (converted to tinyint(1) in MySQL)
        public bool candidateinfo_page { get; set; }  // Validation status for the candidate information page (converted to tinyint(1) in MySQL)
        public string teststatus { get; set; }  // Status of the test (e.g., Passed, Failed)
        public DateTime timestamp { get; set; }  // Timestamp when the record was created or updated

    }
}