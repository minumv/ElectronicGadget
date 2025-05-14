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
    public class ProductController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;

        public ProductController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]

        public async Task<IActionResult> GetProducts()
        {
            var products = await dbContext.Products.ToListAsync();
            return Ok(products);
        }

        [HttpPost]

        public async Task<IActionResult> CreateProduct([FromForm] ProductDto productDto, IFormFile productImage)
        {

            string imagePath = null;

            var imagesDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");

            // ✅ Automatically create the folder if it doesn't exist
            if (!Directory.Exists(imagesDir))
            {
                Directory.CreateDirectory(imagesDir);
            }

            if (productImage != null)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(productImage.FileName);
                var filePath = Path.Combine(imagesDir, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await productImage.CopyToAsync(stream);
                }

                imagePath = "/images/" + fileName;
            }

            var product = new Product
            {
                Id = Guid.NewGuid(),
                ProductName = productDto.ProductName,
                Price = productDto.Price,
                Stock = productDto.Stock,
                Description = productDto.Description,
                ProductImagePath = imagePath
            };

            dbContext.Products.AddAsync(product);
            await dbContext.SaveChangesAsync();

            return Ok(product);
            //prd.Id = Guid.NewGuid();
            //await dbContext.Products.AddAsync(prd);
            //await dbContext.SaveChangesAsync();
            //return Ok();
        }

        [HttpPut]
        [Route("{id:guid}")]

        public async Task<IActionResult> UpdateProduct([FromRoute] Guid id, [FromForm] ProductDto productDto, IFormFile? productImage)
        {
            var product = await dbContext.Products.FirstOrDefaultAsync(x => x.Id == id);
            if (product == null)
            {
                return NotFound($"{nameof(Product)} not found!");
            }

            // Define image storage path
            var imagesDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
            if (!Directory.Exists(imagesDir))
            {
                Directory.CreateDirectory(imagesDir);
            }

            // Handle new image upload (if any)
            if (productImage != null)
            {
                // Optional: delete old image
                if (!string.IsNullOrEmpty(product.ProductImagePath))
                {
                    var oldImagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", product.ProductImagePath.TrimStart('/'));
                    if (System.IO.File.Exists(oldImagePath))
                    {
                        System.IO.File.Delete(oldImagePath);
                    }
                }

                var fileName = Guid.NewGuid() + Path.GetExtension(productImage.FileName);
                var filePath = Path.Combine(imagesDir, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await productImage.CopyToAsync(stream);
                }

                product.ProductImagePath = "/images/" + fileName;
            }

            // Update other fields
            product.ProductName = productDto.ProductName;
            product.Price = productDto.Price;
            product.Stock = productDto.Stock;
            product.Description = productDto.Description;

            await dbContext.SaveChangesAsync();

            return Ok(product);
        }

        [HttpDelete]
        [Route("{id:guid}")]

        public async Task<IActionResult> DeleteProduct([FromRoute] Guid id)
        {
            var product = dbContext.Products.FirstOrDefault(x => x.Id == id);
            if (product != null)
            {
                dbContext.Products.Remove(product);
                await dbContext.SaveChangesAsync();
                return Ok($"{nameof(Product)} deleted");
            }
            return NotFound($"{nameof(Product)} Not found!!");
        }

        [HttpGet]
        [Route("{id:guid}")]
        public async Task<IActionResult> GetProductDetails([FromRoute] Guid id)
        {
            var product = await dbContext.Products.FirstOrDefaultAsync(c => c.Id == id);
            return Ok(product);
        }
    }
}
