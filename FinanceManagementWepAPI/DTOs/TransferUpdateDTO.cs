﻿namespace FinanceManagementWepAPI.DTOs
{
    public class TransferUpdateDTO
    {
        public int FromAccountId { get; set; }
        public int ToAccountId { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
    }
}
