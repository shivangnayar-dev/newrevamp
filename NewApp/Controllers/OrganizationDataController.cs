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
        [HttpPost("saveupdate1")]
        public IActionResult SaveOrUpdateTestCode([FromBody] OrganizationTestDetails request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    // 🔎 Debug here to check model binding issues
                    return BadRequest(ModelState);
                }

                var existingTest = _context.OrganizationTestDetails
                    .FirstOrDefault(t => t.OrganizationId == request.OrganizationId &&
                                         t.OrganizationReportId == request.OrganizationReportId);

                if (existingTest != null)
                {
                    // 🔄 Update Existing Record
                    existingTest.TestCode = request.TestCode;
                    existingTest.ConsultantComments = request.ConsultantComments;
                    existingTest.LogoPath = request.LogoPath;
                    existingTest.StartDate = request.StartDate;
                    existingTest.EndDate = request.EndDate;
                    existingTest.ReportSharingOption = request.ReportSharingOption;
                    existingTest.VideoProctoring = request.VideoProctoring;
                    existingTest.CandidatePhoneNumberRequired = request.CandidatePhoneNumberRequired;
                    existingTest.FitmentRequired = request.FitmentRequired;
                    existingTest.ExtraQuestion1 = request.ExtraQuestion1;
                    existingTest.ExtraQuestion2 = request.ExtraQuestion2;
                    existingTest.ExtraQuestion3 = request.ExtraQuestion3;
                    existingTest.ExtraQuestion4 = request.ExtraQuestion4;
                    existingTest.ExtraQuestion5 = request.ExtraQuestion5;
                    existingTest.TestPurpose = request.TestPurpose;
                    existingTest.PaymentRequired = request.PaymentRequired;
                    existingTest.Price = request.Price;
                    existingTest.Currency = request.Currency;
                    existingTest.DiscountPercentage = request.DiscountPercentage;
                    existingTest.FinalPrice = request.FinalPrice;
                    existingTest.UpdatedDate = DateTime.UtcNow;
                    existingTest.UpdatedBy = request.UpdatedBy;

                    _context.SaveChanges();
                    return Ok(new { Message = "Test code updated successfully." });
                }
                else
                {
                    // 🆕 Create New Record
                    request.CreatedDate = DateTime.UtcNow;
                    request.UpdatedDate = DateTime.UtcNow;
                    _context.OrganizationTestDetails.Add(request);
                    _context.SaveChanges();

                    return Ok(new { Message = "Test code created successfully." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = $"Error saving or updating test code: {ex.Message}" });
            }
        }

        [HttpGet("get-details/{organizationId}")]
        public IActionResult GetTestDetailsByOrganizationId(int organizationId)
        {
            try
            {
                var details = _context.OrganizationTestDetails
                    .Where(t => t.OrganizationId == organizationId)
                    .ToList();

                if (details != null && details.Count > 0)
                {
                    return Ok(details); // Return all test details for the organization
                }

                return NotFound(new { Message = "No test details found for the provided OrganizationId." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error fetching test details: {ex.Message}");
            }
        }
        [HttpPost("SaveAccessDetails")]
        public IActionResult SaveAccessDetails([FromBody] List<OrgLevelAccessData> accessDataList)
        {
            if (accessDataList == null || !accessDataList.Any())
            {
                return BadRequest(new { Message = "Access details are required." });
            }

            try
            {
                foreach (var accessData in accessDataList)
                {
                    // **Handle OrgLevelAccessData Table**
                    var existingAccessData = _context.OrgLevelAccessData
                        .FirstOrDefault(a => a.OrganizationId == accessData.OrganizationId && a.Email == accessData.Email);

                    if (existingAccessData == null)
                    {
                        accessData.CreatedDate = DateTime.UtcNow;
                        accessData.CreatedBy = "SuperAdmin";
                        _context.OrgLevelAccessData.Add(accessData);
                    }
                    else
                    {
                        existingAccessData.OrganizationName = accessData.OrganizationName;
                        existingAccessData.Level = accessData.Level;
                        existingAccessData.CustomerEmployeeName = string.Join(", ", accessData.CustomerEmployeeName);
                        existingAccessData.LinkedLevel2ForLevel3 = accessData.LinkedLevel2ForLevel3 != null
                            ? string.Join(", ", accessData.LinkedLevel2ForLevel3)
                            : null;
                        existingAccessData.UpdatedDate = DateTime.UtcNow;
                        existingAccessData.UpdatedBy = "SuperAdmin";
                    }

                    // **Handle LevelAccessTable**
                    var existingLevelAccess = _context.LevelAccess
                        .FirstOrDefault(l => l.OrganizationId == accessData.OrganizationId && l.Email == accessData.Email);

                    if (existingLevelAccess == null)
                    {
                        var newLevelAccess = new LevelAccess
                        {
                            OrganizationId = accessData.OrganizationId,
                            OrganizationName = accessData.OrganizationName ?? "N/A",
                            Email = accessData.Email ?? "N/A",
                            Level = accessData.Level ?? "1",
                            CustomerEmployeeName = !string.IsNullOrWhiteSpace(accessData.CustomerEmployeeName)
                                ? accessData.CustomerEmployeeName
                                : "N/A",
                            LinkedLevel2ForLevel3 = accessData.LinkedLevel2ForLevel3 ?? null,
                            CreatedDate = DateTime.UtcNow,
                            CreatedBy = "SuperAdmin"
                        };

                        _context.LevelAccess.Add(newLevelAccess);
                    }
                    else
                    {
                        existingLevelAccess.OrganizationName = accessData.OrganizationName ?? existingLevelAccess.OrganizationName;
                        existingLevelAccess.Level = accessData.Level ?? existingLevelAccess.Level;
                        existingLevelAccess.CustomerEmployeeName = !string.IsNullOrWhiteSpace(accessData.CustomerEmployeeName)
                            ? accessData.CustomerEmployeeName
                            : existingLevelAccess.CustomerEmployeeName;
                        existingLevelAccess.LinkedLevel2ForLevel3 = accessData.LinkedLevel2ForLevel3 ?? existingLevelAccess.LinkedLevel2ForLevel3;
                        existingLevelAccess.CreatedDate = DateTime.UtcNow;
                        existingLevelAccess.CreatedBy = "SuperAdmin";
                    }

                    // **Handle PasswordAndAccess Table**
                    var existingPasswordEntry = _context.PasswordAndAccess
                        .FirstOrDefault(p => p.EmailID == accessData.Email && p.OrganisationId == accessData.OrganizationId);

                    if (existingPasswordEntry == null)
                    {
                        var newPasswordEntry = new PasswordAndAccess
                        {
                            EmailID = accessData.Email,
                            Password = "India@123", // Default password
                            OrganisationId = accessData.OrganizationId,
                            OrganizationName = accessData.OrganizationName ?? "N/A",
                            Level = accessData.Level ?? "1",
                            CustomerEmployeeName = !string.IsNullOrWhiteSpace(accessData.CustomerEmployeeName)
                                ? accessData.CustomerEmployeeName
                                : "N/A",
                            LinkedLevel2ForLevel3 = accessData.LinkedLevel2ForLevel3 ?? null,
                            CreatedDate = DateTime.UtcNow,
                            CreatedBy = "SuperAdmin",
                            IsLatestTimestamp = "yes", // Default to "yes"
                            DeactivatedDate = null,
                            DeactivatedBy = null
                        };

                        _context.PasswordAndAccess.Add(newPasswordEntry);
                    }
                    else
                    {
                        existingPasswordEntry.OrganizationName = accessData.OrganizationName ?? existingPasswordEntry.OrganizationName;
                        existingPasswordEntry.Level = accessData.Level ?? existingPasswordEntry.Level;
                        existingPasswordEntry.CustomerEmployeeName = !string.IsNullOrWhiteSpace(accessData.CustomerEmployeeName)
                            ? accessData.CustomerEmployeeName
                            : existingPasswordEntry.CustomerEmployeeName;
                        existingPasswordEntry.LinkedLevel2ForLevel3 = accessData.LinkedLevel2ForLevel3 ?? existingPasswordEntry.LinkedLevel2ForLevel3;
                        existingPasswordEntry.CreatedDate = DateTime.UtcNow;
                        existingPasswordEntry.CreatedBy = "SuperAdmin";
                        existingPasswordEntry.IsLatestTimestamp = "yes"; // Ensure it's marked as latest
                    }
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
        [HttpGet("GetAccessDetailsByOrgId/{orgId}")]
        public IActionResult GetAccessDetailsByOrgId(int orgId)
        {
            try
            {
                var accessDetailsList = _context.OrgLevelAccessData
                    .Where(a => a.OrganizationId == orgId)
                    .Select(a => new
                    {
                        a.OrganizationId,
                        a.OrganizationName,
                        a.Email,
                        a.Level,
                        a.CustomerEmployeeName,
                        a.LinkedLevel2ForLevel3,
                        a.CreatedDate,
                        a.CreatedBy,
                        a.UpdatedDate,
                        a.UpdatedBy
                    })
                    .ToList();

                if (accessDetailsList == null || !accessDetailsList.Any())
                {
                    return NotFound(new { Message = "Access details not found for the given organization ID." });
                }

                return Ok(accessDetailsList);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while fetching access details.", Error = ex.Message });
            }
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
                // **New Organization Creation**
                organization.CreatedDate = DateTime.UtcNow;
                organization.CreatedBy = string.IsNullOrWhiteSpace(organization.CreatedBy) ? "SuperAdmin" : organization.CreatedBy;

                // Handle NULL values (store as NULL)
                organization.OrganizationName = string.IsNullOrWhiteSpace(organization.OrganizationName) ? null : organization.OrganizationName;
                organization.CG_SuperAdminEmailId = string.IsNullOrWhiteSpace(organization.CG_SuperAdminEmailId) ? null : organization.CG_SuperAdminEmailId;
                organization.Customer_SuperAdminEmailId = string.IsNullOrWhiteSpace(organization.Customer_SuperAdminEmailId) ? null : organization.Customer_SuperAdminEmailId;
                organization.Customer_AdminEmailId1 = string.IsNullOrWhiteSpace(organization.Customer_AdminEmailId1) ? null : organization.Customer_AdminEmailId1;
                organization.Customer_AdminEmailId2 = string.IsNullOrWhiteSpace(organization.Customer_AdminEmailId2) ? null : organization.Customer_AdminEmailId2;
                organization.Customer_AdminEmailId3 = string.IsNullOrWhiteSpace(organization.Customer_AdminEmailId3) ? null : organization.Customer_AdminEmailId3;
                organization.Customer_AdminEmailId4 = string.IsNullOrWhiteSpace(organization.Customer_AdminEmailId4) ? null : organization.Customer_AdminEmailId4;
                organization.Customer_AdminEmailId5 = string.IsNullOrWhiteSpace(organization.Customer_AdminEmailId5) ? null : organization.Customer_AdminEmailId5;
                organization.organization_type = string.IsNullOrWhiteSpace(organization.organization_type) ? null : organization.organization_type;
                organization.registration_number = string.IsNullOrWhiteSpace(organization.registration_number) ? null : organization.registration_number;

                _context.OrganizationData.Add(organization);
            }
            else
            {
                // **Update Existing Organization**
                var existingOrganization = _context.OrganizationData.FirstOrDefault(o => o.OrganizationId == organization.OrganizationId);
                if (existingOrganization == null)
                {
                    return NotFound(new { Message = "Organization not found." });
                }

                // **Update fields while keeping NULL values if applicable**
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

                // **Update metadata**
                existingOrganization.UpdatedDate = DateTime.UtcNow;
                existingOrganization.UpdatedBy = string.IsNullOrWhiteSpace(organization.UpdatedBy) ? "SuperAdmin" : organization.UpdatedBy;
            }

            _context.SaveChanges(); // Save changes in `OrganizationData`

            // **Handle LevelAccessTable and PasswordAndAccess**
            List<string> emails = new List<string>
    {
        organization.CG_SuperAdminEmailId,
        organization.Customer_SuperAdminEmailId,
        organization.Customer_AdminEmailId1,
        organization.Customer_AdminEmailId2,
        organization.Customer_AdminEmailId3,
        organization.Customer_AdminEmailId4,
        organization.Customer_AdminEmailId5
    };

            foreach (var email in emails)
            {
                if (!string.IsNullOrWhiteSpace(email)) // Ensure email is not empty
                {
                    // Check if email already exists in LevelAccessTable
                    bool emailExists = _context.LevelAccess
                        .Any(a => a.OrganizationId == organization.OrganizationId && a.Email == email);

                    if (!emailExists) // Only add if email is new
                    {
                        var accessEntry = new LevelAccess
                        {
                            OrganizationId = organization.OrganizationId,
                            OrganizationName = organization.OrganizationName ?? "N/A",
                            Email = email,
                            Level = "1",
                            CustomerEmployeeName = "N/A",
                            LinkedLevel2ForLevel3 = null,
                            CreatedDate = DateTime.UtcNow,
                            CreatedBy = "SuperAdmin"
                        };

                        _context.LevelAccess.Add(accessEntry);
                    }

                    // **Handle PasswordAndAccess Table**
                    var existingPasswordEntry = _context.PasswordAndAccess
                        .FirstOrDefault(p => p.EmailID == email && p.OrganisationId == organization.OrganizationId);

                    if (existingPasswordEntry == null)
                    {
                        var newPasswordEntry = new PasswordAndAccess
                        {
                            EmailID = email,
                            Password = "India@123", // Default password
                            OrganisationId = organization.OrganizationId,
                            OrganizationName = organization.OrganizationName ?? "N/A",
                            Level = "1",
                            CustomerEmployeeName = "N/A",
                            LinkedLevel2ForLevel3 = null,
                            CreatedDate = DateTime.UtcNow,
                            CreatedBy = "SuperAdmin",
                            IsLatestTimestamp = "yes", // Default to "yes"
                            DeactivatedDate = null,
                            DeactivatedBy = null
                        };

                        _context.PasswordAndAccess.Add(newPasswordEntry);
                    }
                    else
                    {
                        existingPasswordEntry.OrganizationName = organization.OrganizationName ?? existingPasswordEntry.OrganizationName;
                        existingPasswordEntry.Level = "1";
                        existingPasswordEntry.CustomerEmployeeName = "N/A";
                        existingPasswordEntry.LinkedLevel2ForLevel3 = null;
                        existingPasswordEntry.CreatedDate = DateTime.UtcNow;
                        existingPasswordEntry.CreatedBy = "SuperAdmin";
                        existingPasswordEntry.IsLatestTimestamp = "yes"; // Ensure it's marked as latest
                    }
                }
            }

            _context.SaveChanges(); // Save all changes

            return Ok(new { Message = "Organization saved successfully." });
        }

        [HttpGet("GetReports")]
        public IActionResult GetReports()
        {
            var reports = _context.ReportData
                .Select(r => new ReportData
                {
                    ReportId = r.ReportId,
                    Name = r.Name
                }).ToList();

            return Ok(reports);
        }
        [HttpPost("SaveOrUpdateReportDetails")]
        public IActionResult SaveOrUpdateReportDetails([FromBody] OrganizationReportData reportData)
        {
            if (reportData == null)
            {
                return BadRequest(new { Message = "Report data is required." });
            }

            // Check if the report already exists
            var reportIdString = reportData.ReportId.ToString();
            var existingReport = _context.OrganizationReportData
                .FirstOrDefault(r => r.ReportId == reportIdString);

            if (existingReport != null)
            {
                // Update the existing report
                existingReport.OrganizationId = reportData.OrganizationId;
                existingReport.ReportId = reportData.ReportId;
                existingReport.Minimumcostofreport = reportData.Minimumcostofreport;
                existingReport.MarkuponMinimumcost = reportData.MarkuponMinimumcost;
                existingReport.TotalCost = reportData.TotalCost;
                existingReport.Contract_Startdate = reportData.Contract_Startdate;
                existingReport.Contract_Enddate = reportData.Contract_Enddate;

                // Update audit fields
                existingReport.UpdatedDate = DateTime.UtcNow;
                existingReport.UpdatedBy = reportData.UpdatedBy;
            }
            else
            {
                // Create a new report entry
                reportData.CreatedDate = DateTime.UtcNow;
                reportData.CreatedBy = reportData.CreatedBy;
                _context.OrganizationReportData.Add(reportData);
            }
            _context.SaveChanges();
            // Save changes to the database

            return Ok(new { Message = "Report details saved successfully." });
        }
        [HttpPost("SaveOrUpdateInvoiceDetails")]
        public IActionResult SaveOrUpdateInvoiceDetails([FromBody] InvoiceData invoiceData)
        {
            if (invoiceData == null)
            {
                return BadRequest(new { Message = "Invoice data is required." });
            }

            // Check if the invoice already exists by InvoiceGUID
            var existingInvoice = _context.InvoiceData.FirstOrDefault(i => i.InvoiceGUID == invoiceData.InvoiceGUID);

            if (existingInvoice != null)
            {
                // Update the existing invoice details
                existingInvoice.OrganizationId = invoiceData.OrganizationId;
                existingInvoice.ReportId = invoiceData.ReportId;
                existingInvoice.CodeOfReport = invoiceData.CodeOfReport;
                existingInvoice.CountOfTest = invoiceData.CountOfTest;
                existingInvoice.CountOfReports = invoiceData.CountOfReports;
                existingInvoice.TotalCost = invoiceData.TotalCost;
                existingInvoice.SumOfCost = invoiceData.SumOfCost;
                existingInvoice.Status = invoiceData.Status;
                existingInvoice.DiscountAmount = invoiceData.DiscountAmount;

                // Update audit fields
                existingInvoice.UpdatedDate = DateTime.UtcNow;
                existingInvoice.UpdatedBy = invoiceData.UpdatedBy;
            }
            else
            {
                // Create a new invoice entry
                invoiceData.CreatedDate = DateTime.UtcNow;
                invoiceData.CreatedBy = invoiceData.CreatedBy;
                invoiceData.InvoiceGUID = Guid.NewGuid();  // Generate a new GUID if it's a new record
                _context.InvoiceData.Add(invoiceData);
            }

            // Save changes to the database
            _context.SaveChanges();
            return Ok(new { Message = "Invoice details saved successfully." });
        }
        [HttpGet("GetReportDetailsByOrgId/{orgId}")]
        public IActionResult GetReportDetailsByOrgId(int orgId)
        {
            try
            {
                // Fetch report details from the database for the given organization ID
                var reportDetails = _context.OrganizationReportData
                    .Where(r => r.OrganizationId == orgId)
                    .Select(r => new
                    {
                        OrganizationReportId = r.OrganizationReportId,
                        OrganizationId = r.OrganizationId,
                        ReportId = r.ReportId ?? "null",
                        MinimumCostOfReport = r.Minimumcostofreport,
                        MarkupOnMinimumCost = r.MarkuponMinimumcost,
                        TotalCost = r.TotalCost,
                        ContractStartDate = r.Contract_Startdate,
                        ContractEndDate = r.Contract_Startdate
                    })
                    .FirstOrDefault();

                if (reportDetails == null)
                {
                    return NotFound(new { Message = "Report details not found for the given organization ID." });
                }

                return Ok(reportDetails);
            }
            catch (Exception ex)
            {
                // Log the error and return a 500 status code
                Console.WriteLine($"Error fetching report details: {ex.Message}");
                return StatusCode(500, "Internal server error.");
            }
        }
        [HttpGet("GetInvoiceDetailsByOrgId/{orgId}")]
        public IActionResult GetInvoiceDetailsByOrgId(int orgId)
        {
            try
            {
                // Fetch invoice details from the database for the given organization ID
                var invoiceDetails = _context.InvoiceData
             .Where(i => i.OrganizationId == orgId)
             .Select(i => new
             {
                 InvoiceGUID = i.InvoiceGUID,
                 OrganizationId = i.OrganizationId,
                 ReportId = i.ReportId ?? string.Empty,
                 CodeOfReport = i.CodeOfReport ?? string.Empty,
                 CountOfTest = i.CountOfTest,
                 CountOfReports = i.CountOfReports,
                 InvoiceTotalCost = i.TotalCost,
                 SumOfCost = i.SumOfCost,
                 CreatedDate = i.CreatedDate,
                 UpdatedDate = i.UpdatedDate,
                 CreatedBy = i.CreatedBy ?? string.Empty,
                 UpdatedBy = i.UpdatedBy ?? string.Empty,
                 Status = i.Status ?? string.Empty,
                 DiscountAmount = i.DiscountAmount
             })
             .FirstOrDefault();

                if (invoiceDetails == null)
                {
                    return NotFound(new { Message = "Invoice details not found for the given organization ID." });
                }

                return Ok(invoiceDetails);
            }
            catch (Exception ex)
            {
                // Log the error and return a 500 status code
                Console.WriteLine($"Error fetching invoice details: {ex.Message}");
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
