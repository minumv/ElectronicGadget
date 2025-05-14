using System.ComponentModel.DataAnnotations;

namespace ElectronicGadgetsAPI.Models
{
    public class Product
    {
        [Key]
        public Guid Id { get; set; }

        public string ProductName { get; set; }

        public float Price { get; set; }

        public int Stock { get; set; }     

        public string Description { get; set; }

        public string ProductImagePath { get; set; }
    }
}
