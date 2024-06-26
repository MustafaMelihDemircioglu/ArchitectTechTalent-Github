using FinanceManagementWepAPI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace FinanceManagementWepAPI.Base
{
    public class Singleton : ISingleton
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public Singleton(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        public FinancialManagementContext GetDbContext()
        {
            var scope = _scopeFactory.CreateScope();
            return scope.ServiceProvider.GetRequiredService<FinancialManagementContext>();
        }
    }

    public interface ISingleton
    {
        FinancialManagementContext GetDbContext();
    }
}
