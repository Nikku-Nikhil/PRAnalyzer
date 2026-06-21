using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PRAnalyzerApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Developers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Develope__3214EC0724BFAFDB", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "IssueDomains",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__IssueDom__3214EC075A3F4BBD", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PullRequests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    PrUrl = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP"),
                    DeveloperId = table.Column<int>(type: "INTEGER", nullable: true),
                    PrTitle = table.Column<string>(type: "TEXT", nullable: true),
                    AsigneesCount = table.Column<int>(type: "INTEGER", nullable: true),
                    Status = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__PullRequ__3214EC071D1C9C0D", x => x.Id);
                    table.ForeignKey(
                        name: "FK__PullReque__Devel__3A81B327",
                        column: x => x.DeveloperId,
                        principalTable: "Developers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PRFiles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    PullRequestId = table.Column<int>(type: "INTEGER", nullable: false),
                    FileName = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    Content = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__PRFiles__3214EC076F0593CA", x => x.Id);
                    table.ForeignKey(
                        name: "FK__PRFiles__PullReq__3D5E1FD2",
                        column: x => x.PullRequestId,
                        principalTable: "PullRequests",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PRDiagnostics",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    PRFileId = table.Column<int>(type: "INTEGER", nullable: false),
                    DiagnosticId = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Message = table.Column<string>(type: "TEXT", nullable: false),
                    Severity = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    LineNumber = table.Column<int>(type: "INTEGER", nullable: true),
                    DomainId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__PRDiagno__3214EC076F790369", x => x.Id);
                    table.ForeignKey(
                        name: "FK__PRDiagnos__Domai__4316F928",
                        column: x => x.DomainId,
                        principalTable: "IssueDomains",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK__PRDiagnos__PRFil__4222D4EF",
                        column: x => x.PRFileId,
                        principalTable: "PRFiles",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_PRDiagnostics_DomainId",
                table: "PRDiagnostics",
                column: "DomainId");

            migrationBuilder.CreateIndex(
                name: "IX_PRDiagnostics_PRFileId",
                table: "PRDiagnostics",
                column: "PRFileId");

            migrationBuilder.CreateIndex(
                name: "IX_PRFiles_PullRequestId",
                table: "PRFiles",
                column: "PullRequestId");

            migrationBuilder.CreateIndex(
                name: "IX_PullRequests_DeveloperId",
                table: "PullRequests",
                column: "DeveloperId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PRDiagnostics");

            migrationBuilder.DropTable(
                name: "IssueDomains");

            migrationBuilder.DropTable(
                name: "PRFiles");

            migrationBuilder.DropTable(
                name: "PullRequests");

            migrationBuilder.DropTable(
                name: "Developers");
        }
    }
}
