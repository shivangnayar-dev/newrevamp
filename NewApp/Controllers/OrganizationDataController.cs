using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using NewApp.Models;
using Microsoft.EntityFrameworkCore;

namespace NewApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrganizationDataController : ControllerBase
    {
        private readonly CandidateDbContext _context;

        public OrganizationDataController(CandidateDbContext context)
        {
            _context = context;
        }

        // Get all organizations
        [HttpGet("GetAll")]
        public IActionResult GetAllOrganizations()
        {
            var organizations = _context.OrganizationData
                .Select(o => new OrganizationData
                {
                    OrganizationId = o.OrganizationId,
                    OrganizationName = o.OrganizationName ?? "N/A",
                    CG_SuperAdminEmailId = o.CG_SuperAdminEmailId ?? "N/A",
                    Customer_SuperAdminEmailId = o.Customer_SuperAdminEmailId ?? "N/A",
                    Customer_AdminEmailId1 = o.Customer_AdminEmailId1 ?? "N/A",
                    Customer_AdminEmailId2 = o.Customer_AdminEmailId2 ?? "N/A",
                    Customer_AdminEmailId3 = o.Customer_AdminEmailId3 ?? "N/A",
                    Customer_AdminEmailId4 = o.Customer_AdminEmailId4 ?? "N/A",
                    Customer_AdminEmailId5 = o.Customer_AdminEmailId5 ?? "N/A",
                    CreatedDate = o.CreatedDate,
                    CreatedBy = o.CreatedBy ?? "System",
                    UpdatedDate = o.UpdatedDate ?? o.CreatedDate,
                    UpdatedBy = o.UpdatedBy ?? "System",
                    organization_type = o.organization_type ?? "General",
                    registration_number = o.registration_number ?? "Not Registered"
                })
                .ToList();

            return Ok(organizations);
        }

        [HttpGet("GetById/{id}")]
        public IActionResult GetOrganizationById(int id)
        {
            try
            {
                // Fetch organization details from the database
                var organization = _context.OrganizationData
                    .Where(o => o.OrganizationId == id)
                    .Select(o => new
                    {
                        OrganizationId = o.OrganizationId,
                        OrganizationName = o.OrganizationName ?? "null",
                        CG_SuperAdminEmailId = o.CG_SuperAdminEmailId ?? "null",
                        Customer_SuperAdminEmailId = o.Customer_SuperAdminEmailId ?? "null",
                        Customer_AdminEmailId1 = o.Customer_AdminEmailId1 ?? "null",
                        Customer_AdminEmailId2 = o.Customer_AdminEmailId2 ?? "null",
                        Customer_AdminEmailId3 = o.Customer_AdminEmailId3 ?? "null",
                        Customer_AdminEmailId4 = o.Customer_AdminEmailId4 ?? "null",
                        Customer_AdminEmailId5 = o.Customer_AdminEmailId5 ?? "null",
                        organization_type = o.organization_type ?? "null",
                        registration_number = o.registration_number ?? "null"
                    })
                    .FirstOrDefault();

                // Check if the organization was found
                if (organization == null)
                {
                    return NotFound(new { Message = "Organization not found." });
                }

                // Return the organization data
                return Ok(organization);
            }
            catch (System.Exception ex)
            {
                // Log the error and return a 500 status code
                Console.WriteLine($"Error fetching organization details: {ex.Message}");
                return StatusCode(500, "Internal server error.");
            }
        }

        // Create or update an organization
        [HttpPost("CreateOrUpdate")]
        public IActionResult CreateOrUpdateOrganization([FromBody] OrganizationData organization)
        {
            if (organization == null)
            {
                return BadRequest(new { Message = "Organization data is required." });
            }

            if (organization.OrganizationId == 0)
            {
                // Create new organization
                organization.CreatedDate = DateTime.UtcNow;
                organization.CreatedBy = "SuperAdmin";
                _context.OrganizationData.Add(organization);
            }
            else
            {
                // Update existing organization
                var existingOrganization = _context.OrganizationData.FirstOrDefault(o => o.OrganizationId == organization.OrganizationId);
                if (existingOrganization == null)
                {
                    return NotFound(new { Message = "Organization not found." });
                }

                // Update only non-null fields
                existingOrganization.OrganizationName = string.IsNullOrWhiteSpace(organization.OrganizationName) ? existingOrganization.OrganizationName : organization.OrganizationName;
                existingOrganization.CG_SuperAdminEmailId = string.IsNullOrWhiteSpace(organization.CG_SuperAdminEmailId) ? existingOrganization.CG_SuperAdminEmailId : organization.CG_SuperAdminEmailId;
                existingOrganization.Customer_SuperAdminEmailId = string.IsNullOrWhiteSpace(organization.Customer_SuperAdminEmailId) ? existingOrganization.Customer_SuperAdminEmailId : organization.Customer_SuperAdminEmailId;
                existingOrganization.Customer_AdminEmailId1 = string.IsNullOrWhiteSpace(organization.Customer_AdminEmailId1) ? existingOrganization.Customer_AdminEmailId1 : organization.Customer_AdminEmailId1;
                existingOrganization.Customer_AdminEmailId2 = string.IsNullOrWhiteSpace(organization.Customer_AdminEmailId2) ? existingOrganization.Customer_AdminEmailId2 : organization.Customer_AdminEmailId2;
                existingOrganization.Customer_AdminEmailId3 = string.IsNullOrWhiteSpace(organization.Customer_AdminEmailId3) ? existingOrganization.Customer_AdminEmailId3 : organization.Customer_AdminEmailId3;
                existingOrganization.Customer_AdminEmailId4 = string.IsNullOrWhiteSpace(organization.Customer_AdminEmailId4) ? existingOrganization.Customer_AdminEmailId4 : organization.Customer_AdminEmailId4;
                existingOrganization.Customer_AdminEmailId5 = string.IsNullOrWhiteSpace(organization.Customer_AdminEmailId5) ? existingOrganization.Customer_AdminEmailId5 : organization.Customer_AdminEmailId5;
                existingOrganization.organization_type = string.IsNullOrWhiteSpace(organization.organization_type) ? existingOrganization.organization_type : organization.organization_type;
                existingOrganization.registration_number = string.IsNullOrWhiteSpace(organization.registration_number) ? existingOrganization.registration_number : organization.registration_number;

                // Update metadata fields
                existingOrganization.UpdatedDate = DateTime.UtcNow;
                existingOrganization.UpdatedBy = "SuperAdmin";
            }

            _context.SaveChanges();
            return Ok(new { Message = "Organization saved successfully." });
        }

        // Save access details
        [HttpPost("SaveAccessDetails")]
        public IActionResult SaveAccessDetails([FromBody] OrgLevelAccessData accessData)
        {
            if (accessData == null)
            {
                return BadRequest(new { Message = "Access details are required." });
            }

            try
            {
                var existingAccessData = _context.OrgLevelAccessData
                    .FirstOrDefault(a => a.OrganizationId == accessData.OrganizationId);

                if (existingAccessData == null)
                {
                    accessData.CreatedDate = DateTime.UtcNow;
                    accessData.CreatedBy = "SuperAdmin";
                    _context.OrgLevelAccessData.Add(accessData);
                }
                else
                {
                    existingAccessData.AccessEmail_Core = string.IsNullOrWhiteSpace(accessData.AccessEmail_Core) ? existingAccessData.AccessEmail_Core : accessData.AccessEmail_Core;
                    existingAccessData.AccessEmail1 = string.IsNullOrWhiteSpace(accessData.AccessEmail1) ? existingAccessData.AccessEmail1 : accessData.AccessEmail1;
                    existingAccessData.UpdatedDate = DateTime.UtcNow;
                    existingAccessData.UpdatedBy = "SuperAdmin";
                }

                _context.SaveChanges();
                return Ok(new { Message = "Access details saved successfully." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving access details: {ex.Message}");
                return StatusCode(500, "Internal server error.");
            }
        }

        // Save organization report
        [HttpPost("SaveOrganizationReport")]
        public IActionResult SaveOrganizationReport([FromBody] OrganizationReportData reportData)
        {
            if (reportData == null)
            {
                return BadRequest(new { Message = "Report data is required." });
            }

            try
            {
                var existingReportData = _context.OrganizationReportData
                    .FirstOrDefault(r => r.OrganizationReportId == reportData.OrganizationReportId);

                if (existingReportData == null)
                {
                    reportData.CreatedDate = DateTime.UtcNow;
                    reportData.CreatedBy = "SuperAdmin";
                    _context.OrganizationReportData.Add(reportData);
                }
                else
                {
                    existingReportData.OrganizationId = reportData.OrganizationId != 0 ? reportData.OrganizationId : existingReportData.OrganizationId;
                    existingReportData.ReportId = !string.IsNullOrWhiteSpace(reportData.ReportId) ? reportData.ReportId : existingReportData.ReportId;
                    existingReportData.UpdatedDate = DateTime.UtcNow;
                    existingReportData.UpdatedBy = "SuperAdmin";
                }

                _context.SaveChanges();
                return Ok(new { Message = "Organization report data saved successfully." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving organization report data: {ex.Message}");
                return StatusCode(500, "Internal server error.");
            }
        }

        // Save invoice details
        [HttpPost("SaveInvoiceDetails")]
        public IActionResult SaveInvoiceDetails([FromBody] InvoiceData invoiceData)
        {
            if (invoiceData == null)
            {
                return BadRequest(new { Message = "Invoice data is required." });
            }

            try
            {
                var existingInvoice = _context.InvoiceData
                    .FirstOrDefault(i => i.InvoiceGUID == invoiceData.InvoiceGUID);

                if (existingInvoice == null)
                {
                    invoiceData.CreatedDate = DateTime.UtcNow;
                    invoiceData.CreatedBy = "Admin";
                    _context.InvoiceData.Add(invoiceData);
                }
                else
                {
                    existingInvoice.OrganizationId = invoiceData.OrganizationId;
                    existingInvoice.ReportId = invoiceData.ReportId;
                    existingInvoice.UpdatedDate = DateTime.UtcNow;
                    existingInvoice.UpdatedBy = "Admin";
                    existingInvoice.Status = invoiceData.Status;
                }

                _context.SaveChanges();
                return Ok(new { Message = "Invoice details saved successfully." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving invoice details: {ex.Message}");
                return StatusCode(500, "Internal server error.");
            }
        }
    }
}
