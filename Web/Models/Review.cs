using System.ComponentModel.DataAnnotations;

namespace Web.Models
{
    public class Review
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string CustomerName { get; set; }

        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }

        [Required]
        public string Comment { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public bool IsVisible { get; set; } = true;
    }
}
