using ElectronicGadgetsAPI.DTOs;

namespace ElectronicGadgetsAPI.Services
{
    public interface IAuthenticationService
    {
        Task<object> Register(RegisterRequest request);
        Task<object> Login(LoginRequest request);
    }
}
