using Azure.Core;
using ElectronicGadgetsAPI.Data;
using ElectronicGadgetsAPI.Entities;
using ElectronicGadgetsAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ElectronicGadgetsAPI.Services
{
    public class CreateAdminUserService
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDbContext _dbContext;
        private readonly ILogger<CreateAdminUserService> _logger;

        public CreateAdminUserService(ApplicationDbContext dbContext, UserManager<User> userManager, RoleManager<IdentityRole> roleManager, ILogger<CreateAdminUserService> logger)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task CreateAdminUserAsync()
        {
            var adminEmail = "admin@gmail.com";
            var adminPassword = "Admin@123";

            // Check if the Admin user already exists
            var existingAdminUser = await _userManager.FindByEmailAsync(adminEmail);
            if (existingAdminUser != null)
            {
                _logger.LogInformation("Admin user already exists.");
                return;
            }

            // Create Admin user
            var adminUser = new User
            {
                UserName = adminEmail,
                Email = adminEmail
            };

            var createUserResult = await _userManager.CreateAsync(adminUser, adminPassword);
            if (!createUserResult.Succeeded)
            {
                _logger.LogError("Failed to create Admin user. Errors: {0}", string.Join(", ", createUserResult.Errors));
                return;
            }

            // Check if the Admin role exists, if not, create it
            var adminRoleExists = await _roleManager.RoleExistsAsync("Admin");
            if (!adminRoleExists)
            {
                var roleCreationResult = await _roleManager.CreateAsync(new IdentityRole("Admin"));
                if (!roleCreationResult.Succeeded)
                {
                    _logger.LogError("Failed to create Admin role. Errors: {0}", string.Join(", ", roleCreationResult.Errors));
                    return;
                }
            }

            // Assign the Admin role to the new Admin user
            var addToRoleResult = await _userManager.AddToRoleAsync(adminUser, "Admin");
            if (!addToRoleResult.Succeeded)
            {
                _logger.LogError("Failed to assign Admin role to the user. Errors: {0}", string.Join(", ", addToRoleResult.Errors));
            }
            else
            {
                var adminCustomer = new Customer
                {

                    Id = Guid.NewGuid(),
                    Name = "null",
                    Email = adminUser.Email,
                    MobileNo = "null",
                    Address = "null",
                    Username = adminUser.UserName,

                    // Add any other customer-specific information you want
                };

                _dbContext.Customers.Add(adminCustomer);
                await _dbContext.SaveChangesAsync();  //
                _logger.LogInformation("Admin user created and assigned to the Admin role successfully.");
            }

           
        }
    }
}
