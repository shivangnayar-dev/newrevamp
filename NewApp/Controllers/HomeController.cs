using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using NewApp.Models;

namespace NewApp.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }


 public IActionResult Test()
    {
        return View();
    }
    public IActionResult Index()
    {
        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }
    public IActionResult AboutUs()
    {
        return View();
    }
    public IActionResult OrganizationForm()
    {
        return View();
    }
    public IActionResult SuperAdminDashboard()
    {
        return View();
    }
    


    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });

    }
      public IActionResult Login()
    {
        // Your logic for the about page
        return View();
    }
    public IActionResult Home()
    {
        // Your logic for the about page
        return View();
    }
    public IActionResult Astro()
    {
        return View();
    }
    public IActionResult Councellor()
    {
        return View();
    }
    public IActionResult career()
    {
        return View();
    }
    public IActionResult RefundPolicy()
    {
        return View();
    }
    public IActionResult Dashboard()
    {
        return View();
    }
    public IActionResult graph()
    {
        return View();
    }
    public IActionResult loginsuperadmin()
    {
        return View();
    }


    public IActionResult candidate_info()
    {
        return View();
    }
    public IActionResult candidate_academic_info()
    {
        return View();
    }
}


