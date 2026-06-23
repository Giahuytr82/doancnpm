using System.ComponentModel.DataAnnotations;

namespace Web.Models
{
    public class Dish
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Price { get; set; }

        public string Description { get; set; }

        public string Badge { get; set; }

        public double Rating { get; set; } = 5.0;

        [Required]
        public string ImageUrl { get; set; }
    }
}
