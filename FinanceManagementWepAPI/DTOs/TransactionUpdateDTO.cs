namespace FinanceManagementWepAPI.DTOs
{
    public class TransactionUpdateDTO
    {
        public decimal Amount { get; set; }
        public string Category { get; set; }
        public DateTime Date { get; set; }
    }
}
