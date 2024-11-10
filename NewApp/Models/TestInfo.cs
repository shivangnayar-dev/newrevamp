using System;
using System.ComponentModel.DataAnnotations;

namespace NewApp.Models
{
    public class TestInfo
    {
        [Required]
        [StringLength(50)]
        public string ReportId { get; set; }

        [Required]
        [StringLength(50)]
        public string TestCode { get; set; }

        [StringLength(100)]
        public string Organisation { get; set; }

        [StringLength(100)]
        public string Screen1 { get; set; }

        [StringLength(100)]
        public string Screen2 { get; set; }

        [StringLength(100)]
        public string Name { get; set; }
    }
}

