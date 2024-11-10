using System;
using Microsoft.EntityFrameworkCore;

namespace NewApp.Models
{
    public class UserDbContext : DbContext
    {
      

        public UserDbContext(DbContextOptions<UserDbContext> options) : base(options) { }

        public DbSet<User> User { get; set; }
        public DbSet<UserToken> UserToken { get; set; }
        public DbSet<CandidateInfo> CandidateInfo { get; set; }
       
    }
}
