

using System;
using Microsoft.EntityFrameworkCore;

namespace NewApp.Models
{
    public class OrganizationReportDataDbContext : DbContext
    {
        public DbSet<OrganizationReportData> OrganizationReportData { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<OrganizationReportData>().ToTable("organizationreportdata");
            modelBuilder.Entity<OrganizationReportData>().HasKey(tm => tm.OrganizationReportId);

            base.OnModelCreating(modelBuilder);
        }
    }
}

