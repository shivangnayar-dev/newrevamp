using System;
using Microsoft.EntityFrameworkCore;

namespace NewApp.Models
{
    public class LevelAccessDbContext : DbContext
    {
        public DbSet<LevelAccess> LevelAccess { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<LevelAccess>().ToTable("LevelAccessTable");
            modelBuilder.Entity<LevelAccess>().HasKey(tm => tm.Id);

            base.OnModelCreating(modelBuilder);
        }
    }
}

