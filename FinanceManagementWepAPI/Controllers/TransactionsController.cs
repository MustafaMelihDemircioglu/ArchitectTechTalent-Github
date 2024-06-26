using FinanceManagementWepAPI.Data;
using FinanceManagementWepAPI.DTOs;
using FinanceManagementWepAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class TransactionsController : ControllerBase
{
    private readonly FinancialManagementContext _context;

    public TransactionsController(FinancialManagementContext context)
    {
        _context = context;
    }

    // GET: api/Transactions
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactions()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized(new { message = "Invalid token, userId is missing" });
        }
        var transactions = await _context.Transactions
            .Where(t => t.UserId == int.Parse(userId))
            .ToListAsync();

        // Convert the DateTime properties to local time
        foreach (var transaction in transactions)
        {
            transaction.Date = transaction.Date.ToLocalTime();
        }

        return transactions;

    }

    // GET: api/Transactions/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Transaction>> GetTransaction(int id)
    {
        var transaction = await _context.Transactions.FindAsync(id);
        if (transaction == null)
        {
            return NotFound();
        }

        return transaction;
    }

    // POST: api/Transactions
    [HttpPost]
    public async Task<ActionResult<Transaction>> PostTransaction(TransactionCreateDTO transactionDto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized(new { message = "Invalid token, userId is missing" });
        }

        var transaction = new Transaction
        {
            UserId = int.Parse(userId),
            Amount = transactionDto.Amount,
            Category = transactionDto.Category,
            Date = transactionDto.Date
        };

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetTransaction", new { id = transaction.Id }, transaction);
    }

    // PUT: api/Transactions/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutTransaction(int id, TransactionUpdateDTO transactionDto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized(new { message = "Invalid token, userId is missing" });
        }

        var transaction = await _context.Transactions.FindAsync(id);
        if (transaction == null || transaction.UserId != int.Parse(userId))
        {
            return NotFound();
        }

        transaction.Amount = transactionDto.Amount;
        transaction.Category = transactionDto.Category;
        transaction.Date = transactionDto.Date;

        _context.Entry(transaction).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/Transactions/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTransaction(int id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized(new { message = "Invalid token, userId is missing" });
        }

        var transaction = await _context.Transactions.FindAsync(id);
        if (transaction == null || transaction.UserId != int.Parse(userId))
        {
            return NotFound();
        }

        _context.Transactions.Remove(transaction);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}