using System;
using System.Security.Claims;
using ElectronicGadgetsAPI.Data;
using ElectronicGadgetsAPI.Models;
using ElectronicGadgetsAPI.Services;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace ElectronicGadgetsAPI.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IChatRepository _chatRepository;
        private readonly ApplicationDbContext _dbContext;

        public ChatHub(IChatRepository chatRepository, ApplicationDbContext dbContext)
        {
            _chatRepository = chatRepository;
            _dbContext = dbContext;
        }

        public async Task SendMessage(Message message)
        {
            var senderId = Context.UserIdentifier;
            if (string.IsNullOrWhiteSpace(senderId) || string.IsNullOrWhiteSpace(message.Receiverid))
                return;

            // Set sender from authenticated context
            message.Senderid = senderId;
            message.Date = DateTime.Now;

            Console.WriteLine($"Message received: Sender={message.Senderid}, Receiver={message.Receiverid}, Content={message.Content}, Date={message.Date}");

            _dbContext.Messages.Add(message);
            await _dbContext.SaveChangesAsync();

            Console.WriteLine("Message saved to database.");

            try
            {
                await Clients.User(message.Senderid).SendAsync("ReceiveMessage", message);
                Console.WriteLine($"Message sent to Sender: {message.Senderid}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send to Sender: {ex.Message}");
            }

            try
            {
                await Clients.User(message.Receiverid).SendAsync("ReceiveMessage", message);
                Console.WriteLine($"Message sent to Receiver: {message.Receiverid}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send to Receiver: {ex.Message}");
            }

        }
        public async Task SendPrivateMessage(string message)
        {
            Console.WriteLine($"Context.UserIdentifier: {Context.UserIdentifier}"); 

            
            Console.WriteLine($"{message} received");

            try
            {
                Console.WriteLine("Inside try block");
            
                Guid adminId = Guid.Parse("E4C8D11A - 9148 - 4F65 - 95DF - F84AF3476FCB");
              

            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
        }

        public override async Task OnConnectedAsync()
        {
            try
            {
                var connectionId = Context.ConnectionId;
                Console.WriteLine($"Client connected: {connectionId}");

                var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier); // or your custom claim
                if (userId != null)
                {
                   
                    Console.WriteLine($"Connected with UserIdentifier: {userId}");
                }
                else
                {
                    Console.WriteLine("No user found!!");
                }
                Console.WriteLine($"Connected UserIdentifier: {Context.UserIdentifier}");

                await base.OnConnectedAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in OnConnectedAsync: {ex.Message}");
            }
            
        }

        public async Task Ping()
        {
            try
            {
                Console.WriteLine($"Ping received from {Context.ConnectionId}");
                await Task.CompletedTask;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in Ping: {ex.Message}");
            }
        }

        public async Task SendGroupMessage(string groupName, string message)
        {
            await Clients.Group(groupName).SendAsync("ReceiveMessage", message);
        }

        public async Task SendBroadcastMessage(string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", message);
        }

        public async Task JoinGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }

        public async Task LeaveGroup(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        }
    }
}
