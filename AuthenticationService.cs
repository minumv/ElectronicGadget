using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ElectronicGadgetsAPI.Data;
using ElectronicGadgetsAPI.DTOs;
using ElectronicGadgetsAPI.Entities;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace ElectronicGadgetsAPI.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _dbContext;
        private readonly IPasswordHelper _passwordHelper;

        public AuthenticationService(UserManager<User> userManager, IConfiguration configuration, ApplicationDbContext dbContext, IPasswordHelper passwordHelper)
        {
            _userManager = userManager;
            _configuration = configuration;
            _dbContext = dbContext;
            _passwordHelper = passwordHelper;
        }
              

        public async Task<object> Register(RegisterRequest request)
        {
            var userByEmail = await _userManager.FindByEmailAsync(request.Email);
            var userByUsername = await _userManager.FindByNameAsync(request.Username);
            if (userByEmail is not null || userByUsername is not null)
            {
                throw new ArgumentException($"User with email {request.Email} or username {request.Username} already exist!");
            }

            User user = new()
            {
                Email = request.Email,
                UserName = request.Username,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if(!result.Succeeded)
            {
                throw new ArgumentException($"Unable to register user {request.Username} errors: {GetErrorsText(result.Errors)}");
            }

            await _userManager.AddToRoleAsync(user, "Customer");

            //return "Successfully registered";
            return (new { message = "Successfully registered" });
            // return await Login(new LoginRequest { Username = request.Email, Password = request.Password });


        }

        public async Task<object> Login(LoginRequest request)
        {
            var user = await _userManager.FindByNameAsync(request.Username);

            if (user is null)
            {
                user = await _userManager.FindByEmailAsync(request.Username);
            }

            if (user is null || !await _userManager.CheckPasswordAsync(user, request.Password))
            {
                throw new ArgumentException($"Unable to authenticate user {request.Username}");
            }

            //fetching roles
            var roles = await _userManager.GetRolesAsync(user);

            //get corresponding customer details from customer table
            var customer = await _dbContext.Customers
                                    .FirstOrDefaultAsync(c => c.Email == user.Email || c.Username == user.UserName);

            if (customer == null)
            {
                throw new Exception("Customer details not found.");
            }

            var authClaims = new List<Claim>
        {
            new(ClaimTypes.Name, user.UserName),
            new(ClaimTypes.Email, user.Email),
            new (ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

            // Add roles to claims
            foreach (var role in roles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role));
            }


            var token = GetToken(authClaims);

            return new
                { 
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    user = new { 
                        Id = customer.Id,
                        Email = customer.Email,
                        Username = customer.Username,
                        Roles = roles
                    }

            };
        }

        private JwtSecurityToken GetToken(IEnumerable<Claim> authClaims)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddHours(3),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256));

            return token;
        }

        private string GetErrorsText(IEnumerable<IdentityError> errors)
        {
            return string.Join(", ", errors.Select(error => error.Description).ToArray());
        }
    }

}

