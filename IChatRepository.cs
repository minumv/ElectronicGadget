using ElectronicGadgetsAPI.Models;

namespace ElectronicGadgetsAPI.Services
{
    public interface IChatRepository
    {
        Task<IEnumerable<Message>> GetMessagesForUser(string userId1);
        //Task AddMessage(ChatMessage message);
        //Task SaveChangesAsync();
    }
}
