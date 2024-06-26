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
public class AccountsController : ControllerBase
{
    private readonly FinancialManagementContext _context;

    public AccountsController(FinancialManagementContext context)
    {
        _context = context;
    }

    // GET: api/Accounts
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Account>>> GetAccounts()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized(new { message = "Invalid token, userId is missing" });
        }

        return await _context.Accounts.Where(a => a.UserId == int.Parse(userId) && a.IsActive == true).ToListAsync();
    }

    // POST: api/Accounts
    [HttpPost]
    public async Task<ActionResult<Account>> PostAccount(AccountCreateDTO accountDto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized(new { message = "Invalid token, userId is missing" });
        }

        var account = new Account
        {
            UserId = int.Parse(userId),
            Balance = accountDto.Balance,
            IsActive = true
        };

        _context.Accounts.Add(account);
        await _context.SaveChangesAsync();

        return CreatedAtAction("PostAccount", new { id = account.Id }, account);
    }

    // PUT: api/Accounts/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutAccount(int id, AccountUpdateDTO accountDto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized(new { message = "Invalid token, userId is missing" });
        }

        var account = await _context.Accounts.FindAsync(id);
        if (account == null)
        {
            return NotFound();
        }

        if (account.UserId != int.Parse(userId))
        {
            return Unauthorized(new { message = "User not authorized to update this account" });
        }

        account.Balance = accountDto.Balance;

        _context.Entry(account).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/Accounts/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAccount(int id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized(new { message = "Invalid token, userId is missing" });
        }

        var account = await _context.Accounts.FindAsync(id);
        if (account == null)
        {
            return NotFound();
        }

        if (account.UserId != int.Parse(userId))
        {
            return Unauthorized(new { message = "User not authorized to delete this account" });
        }

        account.IsActive = false;
        _context.Entry(account).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
