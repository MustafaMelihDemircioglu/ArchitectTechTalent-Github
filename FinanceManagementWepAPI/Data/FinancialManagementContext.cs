using FinanceManagementWepAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace FinanceManagementWepAPI.Data
{
    public class FinancialManagementContext : DbContext
    {
        public FinancialManagementContext(DbContextOptions<FinancialManagementContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Transfer> Transfers { get; set; }
        public DbSet<Account> Accounts { get; set; }
    }
}
