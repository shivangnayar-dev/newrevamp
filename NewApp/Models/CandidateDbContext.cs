using Microsoft.EntityFrameworkCore;

namespace NewApp.Models
{
    public class CandidateDbContext : DbContext
    {
        public CandidateDbContext(DbContextOptions<CandidateDbContext> options) : base(options) { }
        public DbSet<TestInfo> TestInfo { get; set; }
        public DbSet<CandidateDetails> Candidates { get; set; }
        public DbSet<TestCode> TestCodes { get; set; }
        public DbSet<TotalQuestion> TotalQuestions { get; set; } // Add this line

        public DbSet<ReportSubAttribute> ReportSubAttributes { get; set; }
        public DbSet<QuestionAnsMap> QuestionAnsMaps { get; set; } // Add this line
        public DbSet<QualificationTypes> QualificationTypes { get; set; }
        public DbSet<Core> Core { get; set; }
        public DbSet<Specialization> Specialization { get; set; }
        public DbSet<Benchmarkmodel> benchmarkmodel { get; set; }
        public DbSet<QuestionData> QuestionData { get; set; }
        public DbSet<CandidateSelectedOptions> CandidateSelectedOptions { get; set; }
        public DbSet<Result> Result { get; set; }
        public DbSet<AssessmentResults> AssessmentResults { get; set; }
        public DbSet<DatabaseTable> DatabaseTable { get; set; }
        public DbSet<TemperamentTable> TemperamentTable { get; set; }
        public DbSet<bechcomen> bechcomen { get; set; }
        public DbSet<InterestAnswersIIA> InterestAnswersIIA { get; set; }
        public DbSet<StreamJobRole> StreamJobRole { get; set; }
        public DbSet<AcademicStream> AcademicStream { get; set; }
        public DbSet<pexiticsscore> pexiticsscore { get; set; }
        public DbSet<Validationtable> Validationtable { get; set; }
        public DbSet<IIAIndustriessub> IIAIndustriessub { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)

        {
            modelBuilder.Entity<Validationtable>().ToTable("validation_table");
            modelBuilder.Entity<Validationtable>().HasKey(qd => qd.id);
            modelBuilder.Entity<TestInfo>().HasNoKey();
            modelBuilder.Entity<pexiticsscore>().ToTable("pexiticsscore");
            modelBuilder.Entity<pexiticsscore>().HasKey(qd => qd.id);
            modelBuilder.Entity<StreamJobRole>().ToTable("streamjobrole");
            modelBuilder.Entity<StreamJobRole>().HasNoKey();
            modelBuilder.Entity<IIAIndustriessub>().ToTable("IIAIndustriessub");
            modelBuilder.Entity<IIAIndustriessub>().HasNoKey();
            modelBuilder.Entity<bechcomen>().ToTable("bechcomen");
            modelBuilder.Entity<bechcomen>().HasNoKey();
            modelBuilder.Entity<InterestAnswersIIA>().ToTable("InterestAnswersIIA");
            modelBuilder.Entity<InterestAnswersIIA>().HasNoKey();
            modelBuilder.Entity<TemperamentTable>().ToTable("TemperamentTable");
            modelBuilder.Entity<TemperamentTable>().HasKey(qd => qd.id);
            modelBuilder.Entity<Core>().ToTable("DatabaseTable");
            modelBuilder.Entity<Core>().HasKey(qt => qt.Id);
            modelBuilder.Entity<AssessmentResults>().ToTable("AssessmentResults");
            modelBuilder.Entity<AssessmentResults>().HasKey(qd => qd.Id);


            modelBuilder.Entity<Result>().ToTable("Result");
            modelBuilder.Entity<Result>().HasKey(qd => qd.Id);

            modelBuilder.Entity<QuestionData>().ToTable("QuestionData");
            modelBuilder.Entity<QuestionData>().HasKey(qd => qd.SerialNumber);
            // Specify the primary key for CandidateDetails
            modelBuilder.Entity<CandidateDetails>().ToTable("CandidateDetails");
            modelBuilder.Entity<CandidateDetails>().HasKey(c => c.candidate_id);

            modelBuilder.Entity<QualificationTypes>().ToTable("QualificationTypes");
            modelBuilder.Entity<QualificationTypes>().HasKey(qt => qt.Id);
            modelBuilder.Entity<Core>().ToTable("Core");
            modelBuilder.Entity<Core>().HasKey(qt => qt.Id);
            modelBuilder.Entity<Specialization>().ToTable("Specialization");
            modelBuilder.Entity<Specialization>().HasKey(qt => qt.CoreStreamID);

            modelBuilder.Entity<Benchmarkmodel>().ToTable("benchmarkkkkkkk");
            modelBuilder.Entity<Benchmarkmodel>().HasNoKey();

            // Specify the primary key for TestCode
            modelBuilder.Entity<TestCode>().ToTable("testcode");
            modelBuilder.Entity<TestCode>().HasKey(tc => tc.Code);

            // Specify the primary key for TotalQuestion
            modelBuilder.Entity<TotalQuestion>().ToTable("totalquestions");
            modelBuilder.Entity<TotalQuestion>().HasKey(tq => tq.QuestionId);

            modelBuilder.Entity<QuestionAnsMap>().ToTable("QuestionAnsMap");
            modelBuilder.Entity<QuestionAnsMap>().HasKey(qam => qam.AnswerId);
            modelBuilder.Entity<CandidateSelectedOptions>().ToTable("CandidateSelectedOptions");
            modelBuilder.Entity<CandidateSelectedOptions>().HasKey(tm => tm.selected_option);


            // Specify the primary key for ReportSubAttribute
            modelBuilder.Entity<ReportSubAttribute>().ToTable("reportsubattribute");
            modelBuilder.Entity<ReportSubAttribute>().HasKey(rsa => rsa.ReportId);
            modelBuilder.Entity<AcademicStream>().ToTable("AcademicStream");
            modelBuilder.Entity<AcademicStream>().HasNoKey();

            // Other configurations if needed

            base.OnModelCreating(modelBuilder);
        }
    }
}
