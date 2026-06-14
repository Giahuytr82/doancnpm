using System.ComponentModel.DataAnnotations;

namespace Web.Models
{
    public class Bug
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        public string Description { get; set; }

        [Required]
        public string Severity { get; set; } // High, Medium, Low

        [Required]
        public string Status { get; set; } = "New"; // New, InProgress, Fixed, Closed

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public string ReportedBy { get; set; }
    }
}
