using System;
using System.ComponentModel.DataAnnotations;

namespace NewApp.Models
{
    public class UserToken
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Token { get; set; }
        public DateTime ExpiryDate { get; set; }

        public User User { get; set; }
    }
}

