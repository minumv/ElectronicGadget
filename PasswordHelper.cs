using ElectronicGadgetsAPI.Entities;
using Microsoft.AspNetCore.Identity;

namespace ElectronicGadgetsAPI.Services
{
    public class PasswordHelper : IPasswordHelper
    {
       
    private readonly IPasswordHasher<User> _passwordHasher;
        public PasswordHelper(IPasswordHasher<User> passwordHasher)
        {
            _passwordHasher = passwordHasher;
        }

        public string GeneratePassword(User user, string password)
        {
            return _passwordHasher.HashPassword(user, password);
        }

        public string HashPassword(User user, string password)
        {
            throw new NotImplementedException();
        }

        public bool VerifyPassword(User user, string hashedPassword, string password)
        {
            var result = _passwordHasher.VerifyHashedPassword(user, hashedPassword, password);
            // if required, you can handle if result is SuccessRehashNeeded
            return result == PasswordVerificationResult.Success;
        }
    }
}

