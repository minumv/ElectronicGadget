using ElectronicGadgetsAPI.Data;
using ElectronicGadgetsAPI.Entities;
using ElectronicGadgetsAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace ElectronicGadgetsAPI.Services
{
    public class ChatRepository :IChatRepository
    {
        private readonly ApplicationDbContext _context;

        public ChatRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Message>> GetMessagesForUser(string userId)
        {
            // return await _context.ChatMessages
            //.Where(m => (m.SenderId == Guid.Parse(user1) && m.ReceiverId == Guid.Parse(user2)) ||
            //            (m.SenderId == Guid.Parse(user2) && m.ReceiverId == Guid.Parse(user1)))
            //.OrderBy(m => m.Timestamp)
            //.ToListAsync();

            return await _context.Messages
          
           .ToListAsync();
        }

        public async Task AddMessage(Message message)
        {
           // await _context.Messages.AddAsync(message);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
