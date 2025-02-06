using DinkToPdf;
using DinkToPdf.Contracts;
using Microsoft.EntityFrameworkCore;
using NewApp.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHostedService<PexiticsscoreEmailService>();

builder.Configuration.AddJsonFile("appsettings.json");
var configuration = builder.Configuration;
builder.Services.AddSingleton(typeof(IConverter), new SynchronizedConverter(new PdfTools()));

builder.Services.AddDbContext<CandidateDbContext>(options =>
{
    var connectionString = configuration.GetConnectionString("DefaultConnection");
    var serverVersion = ServerVersion.AutoDetect(connectionString);
    options.UseMySql(connectionString, serverVersion);
});

builder.Services.AddDbContext<UserDbContext>(options =>
{
    var connectionString = configuration.GetConnectionString("DefaultConnection");
    var serverVersion = ServerVersion.AutoDetect(connectionString);
    options.UseMySql(connectionString, serverVersion);
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"])), // Key here
        ValidateIssuer = true,
        ValidIssuer = configuration["Jwt:Issuer"],
        ValidateAudience = true,
        ValidAudience = configuration["Jwt:Audience"],
        ValidateLifetime = true
    };
});

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy => policy.WithOrigins("http://example.com", "http://www.contoso.com")
                                      .AllowAnyHeader()
                                      .AllowAnyMethod());
});

// Add services to the container.
builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseStaticFiles();
app.UseRouting();
app.UseCors(MyAllowSpecificOrigins); // Use CORS policy
app.UseAuthentication(); // Ensure this is before UseAuthorization
app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllerRoute(
        name: "code",
        pattern: "code",
        defaults: new { controller = "Home", action = "code" });
     endpoints.MapControllerRoute(
        name: "candidate_info",
        pattern: "candidate_info",
        defaults: new { controller = "Home", action = "candidate_info" });
    endpoints.MapControllerRoute(
     name: "OrganizationForm",
     pattern: "OrganizationForm",
     defaults: new { controller = "Home", action = "OrganizationForm" });
    endpoints.MapControllerRoute(
 name: "SuperAdminDashboard",
 pattern: "SuperAdminDashboard",
 defaults: new { controller = "Home", action = "SuperAdminDashboard" });
    endpoints.MapControllerRoute(
    name: "loginsuperadmin",
    pattern: "loginsuperadmin",
    defaults: new { controller = "Home", action = "loginsuperadmin" });
    endpoints.MapControllerRoute(
        name: "code",
        pattern: "code",
        defaults: new { controller = "Home", action = "Login" });
    endpoints.MapControllerRoute(
    name: "candidate_academic_info",
    pattern: "candidate_academic_info",
    defaults: new { controller = "Home", action = "candidate_academic_info" });

    // Your existing default route
    endpoints.MapControllerRoute(
        name: "Test",
        pattern: "",
        defaults: new { controller = "Home", action = "Index" });
    endpoints.MapControllerRoute(
     name: "career",
     pattern: "career",
     defaults: new { controller = "Home", action = "career" });
    endpoints.MapControllerRoute(
   name: "Dashboard",
   pattern: "Dashboard",
   defaults: new { controller = "Home", action = "Dashboard" });
      endpoints.MapControllerRoute(
        name: "Login",
        pattern: "Login",
         defaults: new { controller = "Home", action = "Login" });

    endpoints.MapControllerRoute(
        name: "Councellor",
        pattern: "Councellor",
         defaults: new { controller = "Home", action = "Councellor" });
    endpoints.MapControllerRoute(
      name: "Index",
      pattern: "Index",
       defaults: new { controller = "Home", action = "Index" });
    endpoints.MapControllerRoute(
    name: "Test",
    pattern: "Test",
     defaults: new { controller = "Home", action = "Test" });
    endpoints.MapControllerRoute(
    name: "Astro",
    pattern: "Astro",
     defaults: new { controller = "Home", action = "Astro" });
    endpoints.MapControllerRoute(
 name: "RefundPolicy",
 pattern: "RefundPolicy",
  defaults: new { controller = "Home", action = "RefundPolicy" });
    endpoints.MapControllerRoute(
 name: "AboutUs",
 pattern: "AboutUs",
  defaults: new { controller = "Home", action = "AboutUs" });

    endpoints.MapControllerRoute(
   name: "Privacy",
   pattern: "Privacy",
    defaults: new { controller = "Home", action = "Privacy" });
    endpoints.MapControllerRoute(
 name: "graph",
 pattern: "graph",
  defaults: new { controller = "Home", action = "graph" });



});

app.Run();
