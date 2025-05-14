using System.ComponentModel.DataAnnotations;

namespace ElectronicGadgetsAPI.Models
{
    public class Customer
    {
        [Key]
        public Guid Id { get; set; }

        public string Username { get; set; }
        public string Name { get; set; }
        public string MobileNo { get; set; }
        public string Email { get; set; }        
        public string Address { get; set; }
    }
}
