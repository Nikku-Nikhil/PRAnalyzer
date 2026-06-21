using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace PRAnalyzerApi.Models;

public partial class PRAnalyzerDbContext : DbContext
{
    public PRAnalyzerDbContext()
    {
    }

    public PRAnalyzerDbContext(DbContextOptions<PRAnalyzerDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Developer> Developers { get; set; }

    public virtual DbSet<IssueDomain> IssueDomains { get; set; }

    public virtual DbSet<Prdiagnostic> Prdiagnostics { get; set; }

    public virtual DbSet<Prfile> Prfiles { get; set; }

    public virtual DbSet<PullRequest> PullRequests { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseSqlite("Data Source=pr_analyzer.db");
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Developer>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Develope__3214EC0724BFAFDB");

            entity.Property(e => e.Email).HasMaxLength(200);
            entity.Property(e => e.Name).HasMaxLength(100);
        });

        modelBuilder.Entity<IssueDomain>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__IssueDom__3214EC075A3F4BBD");

            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.Name).HasMaxLength(100);
        });

        modelBuilder.Entity<Prdiagnostic>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__PRDiagno__3214EC076F790369");

            entity.ToTable("PRDiagnostics");

            entity.Property(e => e.DiagnosticId).HasMaxLength(100);
            entity.Property(e => e.PrfileId).HasColumnName("PRFileId");
            entity.Property(e => e.Severity).HasMaxLength(50);

            entity.HasOne(d => d.Domain).WithMany(p => p.Prdiagnostics)
                .HasForeignKey(d => d.DomainId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PRDiagnos__Domai__4316F928");

            entity.HasOne(d => d.Prfile).WithMany(p => p.Prdiagnostics)
                .HasForeignKey(d => d.PrfileId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PRDiagnos__PRFil__4222D4EF");
        });

        modelBuilder.Entity<Prfile>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__PRFiles__3214EC076F0593CA");

            entity.ToTable("PRFiles");

            entity.Property(e => e.FileName).HasMaxLength(500);

            entity.HasOne(d => d.PullRequest).WithMany(p => p.Prfiles)
                .HasForeignKey(d => d.PullRequestId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PRFiles__PullReq__3D5E1FD2");
        });

        modelBuilder.Entity<PullRequest>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__PullRequ__3214EC071D1C9C0D");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.PrUrl).HasMaxLength(500);

            entity.HasOne(d => d.Developer).WithMany(p => p.PullRequests)
                .HasForeignKey(d => d.DeveloperId)
                .HasConstraintName("FK__PullReque__Devel__3A81B327");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
