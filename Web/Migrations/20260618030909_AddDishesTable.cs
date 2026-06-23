using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Web.Migrations
{
    /// <inheritdoc />
    public partial class AddDishesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Dishes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Price = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Badge = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Rating = table.Column<double>(type: "double", nullable: false),
                    ImageUrl = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dishes", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Dishes",
                columns: new[] { "Name", "Price", "Description", "Badge", "Rating", "ImageUrl" },
                values: new object[,]
                {
                    { "Sashimi Kiệt Tác", "2,450k", "Tuyển chọn từ những loại cá béo ngậy và hải sản cao cấp nhất, nhập khẩu trực tiếp trong ngày từ chợ cá Toyosu tại Tokyo.", "Bếp Trưởng Khuyên Dùng", 4.9, "sashimi.png" },
                    { "A5 Wagyu Đá Nướng", "3,200k", "Thịt bò Wagyu cực phẩm xếp hạng A5 nướng sơ trên đá núi lửa ấm nóng, giữ trọn vẹn vị ngọt đậm đà và vân mỡ mềm tan như bơ.", "Giới Hạn Trong Ngày", 5.0, "wagyu.png" },
                    { "Kyoto Omakase", "4,800k", "Hành trình trải nghiệm ẩm thực độc quyền 12 món do chính Bếp trưởng phục vụ và sáng tạo ngẫu hứng trực tiếp tại quầy gỗ Hinoki.", "Tinh Hoa Nghệ Thuật", 5.0, "interior.png" },
                    { "Tempura Thượng Hạng", "1,250k", "Tôm sú hoàng gia và rau củ theo mùa được chiên giòn hoàn hảo trong lớp bột Tempura mỏng nhẹ, giữ nguyên độ ngọt tự nhiên.", "Ẩm Thực Giòn Rụm", 4.8, "tempura.png" },
                    { "Sushi Gan Ngỗng", "1,850k", "Sự kết hợp hoàn hảo giữa gan ngỗng béo ngậy áp chảo và xốt Unagi ngọt nhẹ trên nền cơm sushi dẻo thơm thượng hạng.", "Hương Vị Béo Ngậy", 4.9, "foie_gras_sushi.png" },
                    { "Tôm Hùm Motoyaki", "2,950k", "Tôm hùm Nha Trang đút lò với xốt kem trứng Motoyaki béo cay đặc trưng, tôn lên vị ngọt giòn và săn chắc của thịt tôm hùm.", "Hải Sản Vương Giả", 5.0, "lobster_motoyaki.png" },
                    { "Cơm Lươn Unagi", "1,450k", "Lươn Nhật nướng sốt Kabayaki gia truyền óng ánh phủ trên cơm nóng dẻo, rắc thêm chút lá tiêu Sansho thanh mát đánh thức vị giác.", "Truyền Thống Nhật Bản", 4.8, "unagi_don.png" },
                    { "Matcha Fondant", "650k", "Bánh dung nham trà xanh Uji Matcha cao cấp tan chảy ấm nóng, ăn kèm kem vani lạnh và bụi vàng 24K dát mỏng quý phái.", "Ngọt Ngào Tinh Tế", 4.9, "matcha_dessert.png" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Dishes");
        }
    }
}
