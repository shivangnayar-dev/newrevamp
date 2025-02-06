

using System;
using Microsoft.EntityFrameworkCore;

namespace NewApp.Models
{
    public class OrgLevelAccessDataDbContext : DbContext
    {
        public DbSet<OrgLevelAccessData> OrgLevelAccessData { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<OrgLevelAccessData>().ToTable("OrgLevelAccessData");
            modelBuilder.Entity<OrgLevelAccessData>().HasKey(tm => tm.OrgLevelAccess1Id);

            base.OnModelCreating(modelBuilder);
        }
    }
}

