using System.ComponentModel.DataAnnotations;

namespace ElectronicGadgetsAPI.Models
{
    public class Cart
    {
        [Key]
        public Guid Id { get; set; }

        public Guid ProductId { get; set; }      // FK

        public Product Product { get; set; }     // Navigation

        public Guid CustomerId { get; set; }     

        public Customer Customer { get; set; }

        public int Quantity { get; set; }
    }
}
