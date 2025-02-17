using System;
using Microsoft.EntityFrameworkCore;

namespace NewApp.Models
{
    public class ReportDataDbContext : DbContext
    {
        public DbSet<ReportData> ReportData{ get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ReportSubAttribute>().ToTable("report_table");
            modelBuilder.Entity<ReportData>().HasNoKey();

            base.OnModelCreating(modelBuilder);
        }
    }
}

