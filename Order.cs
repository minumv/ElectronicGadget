using System.ComponentModel.DataAnnotations;

namespace ElectronicGadgetsAPI.Models
{
    public class Order
    {
        [Key]
        public Guid Id { get; set; }

        public Guid CustomerId { get; set; }
        public Customer Customer { get; set; }

        public DateTime OrderDate { get; set; }

        public float Total { get; set; }

        public string OrderStatus { get; set; }

        public string PaymentMethod { get; set; }

        public ICollection<OrderItem> OrderItems { get; set; }


    }
}
