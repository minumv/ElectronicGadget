using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ElectronicGadgetsAPI.Models
{
    public class OrderItem
    {
        [Key]
        public Guid Id { get; set; }

        public Guid ProductId { get; set; }
        public Product Product { get; set; }

        public int Quantity { get; set; }

        public Guid OrderId { get; set; }

        [JsonIgnore]
        public Order Order { get; set; }
    }
}
