

using System;
using Microsoft.EntityFrameworkCore;

namespace NewApp.Models
{
    public class PasswordAndAccessDbContext : DbContext
    {
        public DbSet<PasswordAndAccess> PasswordAndAccess { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PasswordAndAccess>().ToTable("PasswordAndAccess");
            modelBuilder.Entity<PasswordAndAccess>().HasKey(tm => tm.Id);

            base.OnModelCreating(modelBuilder);
        }
    }
}

