

using System;
using Microsoft.EntityFrameworkCore;

namespace NewApp.Models
{
    public class OrganizationTestDetailsDbContext : DbContext
    {
        public DbSet<OrganizationTestDetails> OrganizationTestDetails { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<OrganizationTestDetails>().ToTable("OrganizationTestDetails");
            modelBuilder.Entity<OrganizationTestDetails>().HasKey(tm => tm.TestCodeId);

            base.OnModelCreating(modelBuilder);
        }
    }
}

