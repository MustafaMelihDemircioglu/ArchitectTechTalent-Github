using FinanceManagementWepAPI.Data;

namespace FinanceManagementWepAPI.Base
{
    public class Connection
    {
        private readonly FinancialManagementContext _context;

        public Connection(FinancialManagementContext context)
        {
            _context = context;
        }

        public FinancialManagementContext GetContext()
        {
            return _context;
        }
    }
}
