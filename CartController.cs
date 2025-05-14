using ElectronicGadgetsAPI.Data;
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
    public class CartController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;

        public CartController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }


        //Get cart count
        [HttpGet("count/{id:guid}")]
        public async Task<IActionResult> GetCartItemCount([FromRoute] Guid id)
        {
            var count = await dbContext.Carts
                .Where(c => c.CustomerId == id)
                .SumAsync(c => c.Quantity);

            return Ok(count);
        }

        //Get allcartitem
        [HttpGet("items/{id:guid}")]
        public async Task<IActionResult> GetCartItems([FromRoute] Guid id)
        {
            var cartItems = await dbContext.Carts
                .Where(c => c.CustomerId == id)
                .Include(c => c.Product)
                .ToListAsync();

            return Ok(cartItems);
        }


        [HttpGet]
        [Route("{custid:guid}/{pdtid:guid}")]

        public async Task<IActionResult> GetUserCartProduct([FromRoute] Guid custid, [FromRoute] Guid pdtid)
        {
            var product = await dbContext.Carts.FirstOrDefaultAsync(c => c.CustomerId == custid && c.ProductId == pdtid);
            return Ok(product);
        }

        [HttpPost]
        [Route("{custid:guid}/{pdtid:guid}")]

        public async Task<IActionResult> AddProductToCart([FromRoute] Guid custid, [FromRoute] Guid pdtid)
        {
            var product = await dbContext.Carts.FirstOrDefaultAsync(c => c.CustomerId == custid && c.ProductId == pdtid);
            if (product == null)
            {
                var cartproduct = new Cart
                {
                    CustomerId = custid,
                    ProductId = pdtid,
                    Quantity = 1

                };
                await dbContext.Carts.AddAsync(cartproduct);
                await dbContext.SaveChangesAsync();
                return Ok(cartproduct);
            }
            product.Quantity = product.Quantity + 1;
            await dbContext.SaveChangesAsync();
            return Ok(product);          
            
        }

        //increment quantity
        [HttpPut("increment/{custId:guid}/{prodId:guid}")]
        public async Task<IActionResult> IncrementCartItem(Guid custId, Guid prodId)
        {
            var cartItem = await dbContext.Carts
                .FirstOrDefaultAsync(c => c.CustomerId == custId && c.ProductId == prodId);

            if (cartItem == null)
                return NotFound("Cart item not found.");

            cartItem.Quantity += 1;
            await dbContext.SaveChangesAsync();

            return Ok(cartItem);
        }

        //decrement quantity
        [HttpPut("decrement/{custId:guid}/{prodId:guid}")]
        public async Task<IActionResult> DecrementCartItem(Guid custId, Guid prodId)
        {
            var cartItem = await dbContext.Carts
                .FirstOrDefaultAsync(c => c.CustomerId == custId && c.ProductId == prodId);

            if (cartItem == null)
                return NotFound("Cart item not found.");

            if (cartItem.Quantity > 1)
            {
                cartItem.Quantity -= 1;
                await dbContext.SaveChangesAsync();
            }
            else
            {
                dbContext.Carts.Remove(cartItem);
                await dbContext.SaveChangesAsync();
            }

            return Ok(cartItem);
        }

        //removing cart item
        [HttpDelete]
        [Route("item/{customerId:guid}/{productId:guid}")]
        public async Task<IActionResult> RemoveCartItem(Guid customerId, Guid productId)
        {
            var cartItem = await dbContext.Carts
                .FirstOrDefaultAsync(c => c.CustomerId == customerId && c.ProductId == productId);

            if (cartItem == null)
            {
                return NotFound("Cart item not found");
            }

            dbContext.Carts.Remove(cartItem);
            await dbContext.SaveChangesAsync();

            return Ok(new { message = "Item removed from cart" });
        }

        //Remove cart entirely
        [HttpDelete]
        [Route("all/{customerId:guid}")]
        public async Task<IActionResult> RemoveCart(Guid customerId)
        {
            var cart = await dbContext.Carts
                .FirstOrDefaultAsync(c => c.CustomerId == customerId);

            if (cart == null)
            {
                return NotFound("Cart is Empty!");
            }

            dbContext.Carts.Remove(cart);
            await dbContext.SaveChangesAsync();

            return Ok(new {message = "Cart Empty!!" });
        }

    }
}
