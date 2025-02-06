

using System;
using Microsoft.EntityFrameworkCore;

namespace NewApp.Models
{
    public class OrganizationDataDbContext : DbContext
    {
        public DbSet<OrganizationData> OrganizationData { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<OrganizationData>().ToTable("organizationdata");
            modelBuilder.Entity<OrganizationData>().HasKey(tm => tm.OrganizationId);

            base.OnModelCreating(modelBuilder);
        }
    }
}

