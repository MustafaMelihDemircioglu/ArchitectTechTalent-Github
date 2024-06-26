namespace FinanceManagementWepAPI.DTOs
{
    public class TransactionCreateDTO
    {
        public decimal Amount { get; set; }
        public string Category { get; set; }
        public DateTime Date { get; set; }
    }
}
