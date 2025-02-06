using System;
using Microsoft.EntityFrameworkCore;

namespace NewApp.Models
{
    public class InvoiceDataDbContext : DbContext
    {
        public DbSet<InvoiceData> InvoiceData { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<InvoiceData>().ToTable(" invoicedata");
            modelBuilder.Entity<InvoiceData>().HasKey(tm => tm.InvoiceGUID);

            base.OnModelCreating(modelBuilder);
        }
    }
}

