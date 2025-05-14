using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElectronicGadgetsAPI.Models
{
    public class Message
    {
        [Key]
        public Guid Id { get; set; }
        public string Senderid { get; set; }
        public string Receiverid { get; set; }
        public string Content { get; set; }
        public DateTime Date { get; set; }

    }
}
