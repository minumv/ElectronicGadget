using System.Net;
using ElectronicGadgetsAPI.Data;
using ElectronicGadgetsAPI.DTOs;
using ElectronicGadgetsAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ElectronicGadgetsAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CustomerController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;

        public CustomerController( ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetCustomer()
        {
            var cuctomer = await dbContext.Customers.ToListAsync();
            return Ok(cuctomer);
        }

        [HttpGet]
        [Route("{id:guid}")]
        public async Task<IActionResult> GetCustomerDetails([FromRoute] Guid id)
        {
            var cuctomer = await dbContext.Customers.FirstOrDefaultAsync(c => c.Id == id);
            return Ok(cuctomer);
        }


        [HttpPut]
        [Route("{id:guid}")]
        public async Task<IActionResult> UpdateCustomer([FromRoute] Guid id,[FromBody] Customer cus)
        {
            var customer = await dbContext.Customers.FirstOrDefaultAsync(c => c.Id == id);
            if (customer != null)
            {
                customer.Name = cus.Name;
                customer.Email = cus.Email;
                customer.Address = cus.Address;
                customer.MobileNo = cus.MobileNo;
                customer.Username = cus.Username;
                await dbContext.SaveChangesAsync();
                return Ok(customer);
            }
            return NotFound("Customer not exist!!");
        }
        [HttpDelete]
        [Route("{id:guid}")]
        public async Task<IActionResult> DeleteCustomer([FromRoute] Guid id)
        {
            var customer = dbContext.Customers.FirstOrDefault(c => c.Id == id);
            if (customer != null)
            {
                dbContext.Customers.Remove(customer);
                await dbContext.SaveChangesAsync();
                return Ok("Customer details deleted  successfully..");
            }
            return NotFound("Customer not found!!");
        }
    }
}
