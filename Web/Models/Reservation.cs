using System.ComponentModel.DataAnnotations;

namespace Web.Models
{
    public class Reservation
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string GuestName { get; set; }

        [Required]
        public string GuestPhone { get; set; }

        [Required]
        public DateTime BookingDate { get; set; }

        [Required]
        public string GuestCount { get; set; }

        [Required]
        public string SeatingPreference { get; set; }

        [Required]
        public string SelectedTime { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        
        public string Status { get; set; } = "Pending"; // Pending, Confirmed, Cancelled
    }
}
