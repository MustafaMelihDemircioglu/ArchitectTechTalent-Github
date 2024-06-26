using FinanceManagementWepAPI.Data;
using FinanceManagementWepAPI.DTOs;
using FinanceManagementWepAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class TransfersController : ControllerBase
{
    private readonly FinancialManagementContext _context;

    public TransfersController(FinancialManagementContext context)
    {
        _context = context;
    }

    // GET: api/Transfers
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Transfer>>> GetTransfers()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized(new { message = "Invalid token, userId is missing" });
        }

        // Assuming you have a way to get user accounts and filter by those accounts
        var userAccounts = await _context.Accounts.Where(a => a.UserId == int.Parse(userId)).Select(a => a.Id).ToListAsync();
        var transfers = await _context.Transfers
                                     .Where(t => userAccounts.Contains(t.FromAccountId) || userAccounts.Contains(t.ToAccountId))
                                     .ToListAsync();

        foreach (var transfer in transfers)
        {
            transfer.Date = transfer.Date.ToLocalTime();
        }

        return transfers;
    }

    // GET: api/Transfers/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Transfer>> GetTransfer(int id)
    {
        var transfer = await _context.Transfers.FindAsync(id);
        if (transfer == null)
        {
            return NotFound();
        }

        return transfer;
    }

    // POST: api/Transfers
    [HttpPost]
    public async Task<ActionResult<Transfer>> PostTransfer(TransferCreateDTO transferDto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized(new { message = "Invalid token, userId is missing" });
        }

        // Assuming you have a way to verify that the accounts belong to the user
        var fromAccount = await _context.Accounts.FindAsync(transferDto.FromAccountId);
        var toAccount = await _context.Accounts.FindAsync(transferDto.ToAccountId);
        if (fromAccount == null || toAccount == null || fromAccount.UserId != int.Parse(userId))
        {
            return BadRequest(new { message = "Invalid account information" });
        }

        fromAccount.Balance -= transferDto.Amount;
        toAccount.Balance += transferDto.Amount;

        var transfer = new Transfer
        {
            FromAccountId = transferDto.FromAccountId,
            ToAccountId = transferDto.ToAccountId,
            Amount = transferDto.Amount,
            Date = transferDto.Date
        };

        _context.Transfers.Add(transfer);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetTransfer", new { id = transfer.Id }, transfer);
    }

    // DELETE: api/Transfers/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTransfer(int id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized(new { message = "Invalid token, userId is missing" });
        }

        var transfer = await _context.Transfers.FindAsync(id);
        if (transfer == null)
        {
            return NotFound();
        }

        var fromAccount = await _context.Accounts.FindAsync(transfer.FromAccountId);
        if (fromAccount == null || fromAccount.UserId != int.Parse(userId))
        {
            return Unauthorized(new { message = "User not authorized to delete this transfer" });
        }

        _context.Transfers.Remove(transfer);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

