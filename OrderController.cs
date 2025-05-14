using ElectronicGadgetsAPI.Data;
using ElectronicGadgetsAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ElectronicGadgetsAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;

        public OrderController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await dbContext.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .ToListAsync();

            return Ok(orders);
        }

        [HttpGet]
        [Route("{id:guid}")]
        public async   Task<IActionResult> GetOrderDetails([FromRoute] Guid id)
        {
            var orderdetails = await dbContext.Orders.FirstOrDefaultAsync(o => o.Id == id);
            return Ok(orderdetails);
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] Order order)
        {
            order.Id = Guid.NewGuid();
            order.OrderDate = DateTime.Now;

            foreach (var item in order.OrderItems)
            {
                item.Id = Guid.NewGuid();
                item.OrderId = order.Id;
            }

            await dbContext.Orders.AddAsync(order);
            await dbContext.SaveChangesAsync();

            return Ok(order);
        }

    }
}
