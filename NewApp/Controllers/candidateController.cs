using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Logging;
using NewApp.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Diagnostics.Metrics;
using System.Globalization;
using System.Linq;
using System.IO;
using System.Net.Mail;
using System;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using static System.Formats.Asn1.AsnWriter;
using DinkToPdf;
using DinkToPdf.Contracts;
using System.Net;

namespace NewApp.Controllers
{
    [Route("api/[controller]")]
    public class CandidateController : Controller
    {
        private readonly CandidateDbContext _context;
        private readonly ILogger<CandidateController> _logger;

        public CandidateController(CandidateDbContext context, ILogger<CandidateController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<CandidateDetails> Get()
        {
            return _context.Candidates.ToList();
        }

        private async Task<(bool exists, string? identifierType)> CheckForDuplicateAsync(CandidateDetails candidate)
        {
            if (!string.IsNullOrEmpty(candidate.Mobile_No) && candidate.Mobile_No != "0")
            {
                bool mobileExists = await _context.Candidates.AnyAsync(c => c.Mobile_No == candidate.Mobile_No);
                return (mobileExists, "Mobile");
            }
            else if (!string.IsNullOrEmpty(candidate.Adhar_No) && candidate.Adhar_No != "0")
            {
                bool aadharExists = await _context.Candidates.AnyAsync(c => c.Adhar_No == candidate.Adhar_No);
                return (aadharExists, "Aadhar");
            }
            else if (!string.IsNullOrEmpty(candidate.email_address) && candidate.email_address != "0")
            {
                bool emailExists = await _context.Candidates.AnyAsync(c => c.email_address == candidate.email_address);
                return (emailExists, "Email");
            }

            return (false, string.Empty);
        }

        [HttpPost("CheckDuplicate")]
        public async Task<IActionResult> CheckDuplicate([FromBody] CandidateDetails candidate)
        {
            try
            {
                _logger.LogInformation($"Checking duplicate for email: {candidate.email_address}");

                var (exists, identifierType) = await CheckForDuplicateAsync(candidate);
                string? password = null;
                string? name = null;
                string? gender = null;
                DateTime? dob = null;
                string? country = null;
                string? location = null;
                string? organization = null;
                string? qualification = null;



                if (exists)
                {
                    // Retrieve password based on the existing entit
                    (password,
    name,
    gender,
    dob, country, location, organization, qualification) = await GetPasswordAndNameByUserAsync(candidate, identifierType);
                }

                return Json(new
                {
                    exists,
                    Password = password,
                    Name = name,
                    Gender = gender,
                    Dob = dob,
                    Country = country,
                    Location = location,
                    Organization = organization,
                    Qualification = qualification

                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error checking duplicate: {ex.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }


        private async Task<(string? password, string? name, string? gender, DateTime? dob, string? country, string? location, string? organization, string? qualification)> GetPasswordAndNameByUserAsync(CandidateDetails candidate, string identifierType)
        {
            try
            {
                _logger.LogInformation($"Retrieving password and name for {identifierType}");

                var query = _context.Candidates
                    .Where(c =>
                        (identifierType == "Mobile" && c.Mobile_No == candidate.Mobile_No) ||
                        (identifierType == "Aadhar" && c.Adhar_No == candidate.Adhar_No) ||
                        (identifierType == "Email" && c.email_address == candidate.email_address));

                var result = await query
                    .OrderByDescending(c =>
                        identifierType == "Mobile" ? c.Mobile_No :
                        identifierType == "Aadhar" ? c.Adhar_No :
                        identifierType == "Email" ? c.email_address :
                        null)
                    .ThenByDescending(c => c.candidate_id)// Default ordering by null in case of unknown identifier
                    .FirstOrDefaultAsync();

                if (result != null)
                {
                    return (
                        result.password,
                        result.name,
                        result.gender,
                        result.dob,
                        result.country,
                        result.location,
                        result.qualification,
                        result.organization
                    );
                }
                else
                {
                    // Log a message if the candidate is not found
                    _logger.LogInformation($"No candidate found for {identifierType}");

                    return (null, null, null, null, null, null, null, null);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving password and name: {ex}");
                return (null, null, null, null, null, null, null, null);
            }
        }




	string storedtestcodee = "";
        string timestart = "";
        string timeend = "";
        int candidateidd = 0;
        [HttpPost("submit")]
        public async Task<IActionResult> SubmitUser([FromBody] CandidateDetails candidate)








        {
            try
            {
                if (ModelState.IsValid)
                {
                    // Check if the candidate with the same Mobile_No, Adhar_No, or email_address already exists
                    var existingCandidate = await _context.Candidates.FirstOrDefaultAsync(c =>
                        (c.Mobile_No != "0" && c.Mobile_No == candidate.Mobile_No) ||
                        (c.Adhar_No != "0" && c.Adhar_No == candidate.Adhar_No) ||
                        (c.email_address != "0" && c.email_address == candidate.email_address));

                    if (existingCandidate != null)
                    {
                        // Ensure unique values in SelectedOptions and SelectedOptionTimestamps
                        var existingOptions = existingCandidate.SelectedOptions.Split(',').ToList();
                        var newOptions = candidate.SelectedOptions.Split(',').ToList();
                        var combinedOptions = existingOptions.Union(newOptions).Distinct().ToList();
                        existingCandidate.SelectedOptions = string.Join(",", combinedOptions);

                        var existingTimestamps = existingCandidate.SelectedOptionTimestamps.Split(',').ToList();
                        var newTimestamps = candidate.SelectedOptionTimestamps.Split(',').ToList();
                        var combinedTimestamps = existingTimestamps.Union(newTimestamps).Distinct().ToList();
                        existingCandidate.SelectedOptionTimestamps = string.Join(",", combinedTimestamps);

                        // Update other candidate details

                        candidateidd = existingCandidate.candidate_id;

                        existingCandidate.name = candidate.name;
                        existingCandidate.gender = candidate.gender;
                        existingCandidate.dob = candidate.dob;
                        existingCandidate.country = candidate.country;
                        existingCandidate.location = candidate.location;
                        existingCandidate.organization = candidate.organization;
                        existingCandidate.qualification = candidate.qualification;
                        existingCandidate.otherOrganization = candidate.otherOrganization;
                        existingCandidate.selectedSpecializations = candidate.selectedSpecializations;
                        existingCandidate.selectedIndustries = candidate.selectedIndustries;
                        existingCandidate.interest = candidate.interest;
                        existingCandidate.pursuing = candidate.pursuing;
                        existingCandidate.transactionId = candidate.transactionId;
                        existingCandidate.rating = candidate.rating;
                        existingCandidate.storedTestCode = candidate.storedTestCode;
                        existingCandidate.upiPhoneNumber = candidate.upiPhoneNumber;
                        existingCandidate.amountPaid = candidate.amountPaid;
                        existingCandidate.mathScience = candidate.mathScience;
                        existingCandidate.testProgress = candidate.testProgress;
                        existingCandidate.science = candidate.science;
                        existingCandidate.govJobs = candidate.govJobs;
                        existingCandidate.armedForcesJobs = candidate.armedForcesJobs;
                        existingCandidate.coreStream = candidate.coreStream;
                        existingCandidate.academicStream = candidate.academicStream;
                        existingCandidate.timestamp_start = candidate.timestamp_start;
                        existingCandidate.timestamp_end = candidate.timestamp_end;
			  existingCandidate.storedTestCode = candidate.storedTestCode;
			   existingCandidate.mathStats = candidate.mathStats;
                        existingCandidate.SportsJobs = candidate.SportsJobs;
                        timestart = existingCandidate.timestamp_start;
                        timeend = existingCandidate.timestamp_end;

                        storedtestcodee = existingCandidate.storedTestCode;
                      
                        _context.Candidates.Update(existingCandidate);

                    }
                    else
                    {
                        // Ensure unique values in new candidate's SelectedOptions and SelectedOptionTimestamps
                        candidate.SelectedOptions = string.Join(",", candidate.SelectedOptions.Split(',').Distinct());	

                        _context.Candidates.Add(candidate);
                    }
		  
                    List<string> selectedOptionsList = GetSelectedOptionsList(candidateidd, candidate.name, candidate.SelectedOptions, candidate.testProgress, candidate.rating, candidate.dob, candidate.mathScience);

                    if (candidate.testProgress != "0")
                    {
                        await GetTop5Motivations(candidate.SelectedOptions, candidateidd);

                        List<string> IndustryList = new List<string>();

                        await MapAnswerIdToIIAFitmentAsync();
                        await SubIndustries();


                        await AddDataToDatabaseTable(candidateidd, candidate.dob);
                        await GetCareerChoicesFromTemperamentTable(candidate.dob, candidateidd);

                        await GetJobStream(candidate.selectedSpecializations, candidate.mathScience, candidate.science, selectedOrganisation, candidate.selectedIndustries);
                        AddDataFromSelectedTables(candidateidd, candidate.storedTestCode);
                        var reportHtml = await GenerateReport(candidateidd);

                        if (string.IsNullOrEmpty(reportHtml))
                        {
                            return StatusCode(500, "Error generating report");
                        }

                        // Save the modified HTML to a file and get the relative URL
                        string relativeUrl = SaveHtmlToWwwroot(reportHtml, candidate.name);

                        // Construct the full URL
                        string fileUrl = $"{Request.Scheme}://{Request.Host}{relativeUrl}";
                        AddToResultTable("result", "reporturl", fileUrl, candidateidd, "");
                        string recipientEmail;
                        string subject = "Your Report is Ready";
                        string body;

                        // Determine recipient email based on candidate's organization



			   // Determine recipient email based on candidate's organization
                        List<string> recipientEmails = new List<string>
                {
                    "subhashini@pexitics.com",
                    "shivangnayar22@gmail.com"
                };

                        switch (candidate.organization.ToLower())
                        {
                            case "vibe fintech":
                                recipientEmails.Add("vikram@vibefintech.com");
                                break;
                            case "supreme court":
                                recipientEmails.Add("purushottam.st@gmail.com");
                                break;
				   case "Pexitics":
                                recipientEmails.Add("reuben@pexitics.com");
                                break;

                        }

                        if (!string.IsNullOrWhiteSpace(candidate.email_address))
                        {
                            recipientEmails.Add(candidate.email_address);
                        }

                        // Prepare email message body
                        body = $"Dear Candidate,\n\nYour report is ready.\n\nOrganization: {candidate.organization}\nName: {candidate.name}\n\nPlease click here to view your report: <a href=\"{fileUrl}\">Click Here</a>\n\nThank you for taking the test with {candidate.organization}.";

                        // Send email
                        await SendEmailAsync(recipientEmails, subject, body);
                        await _context.SaveChangesAsync();

                        // Return the URL
                        return Ok(fileUrl);


                    }

                    await _context.SaveChangesAsync();
                    return Ok("Data submitted successfully");

                }

                return BadRequest(ModelState);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error submitting user data: {ex.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }
        private async Task SendEmailAsync(List<string> recipientEmails, string subject, string htmlMessage)
        {
            try
            {
                var smtpServer = "smtp.gmail.com"; // Replace with your SMTP server
                var smtpPort = 587; // Replace with your SMTP port
                var enableSsl = true; // Replace with your SSL/TLS configuration
                var username = "ai.careertests@gmail.com"; // Replace with your email address
                var password = "szyaorwsvdbdajqb"; // Replace with your app-specific password

                using (var client = new SmtpClient(smtpServer, smtpPort))
                {
                    client.UseDefaultCredentials = false;
                    client.Credentials = new NetworkCredential(username, password);
                    client.EnableSsl = enableSsl;

                    var message = new MailMessage();
                    message.From = new MailAddress(username);

                    foreach (var recipientEmail in recipientEmails)
                    {
                        message.To.Add(recipientEmail);
                    }

                    message.Subject = subject;
                    message.Body = htmlMessage;
                    message.IsBodyHtml = true;

                    await client.SendMailAsync(message);
                }
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"Error sending email: {ex.Message}");
            }
        }
        private string SaveHtmlToWwwroot(string htmlContent,string name)
        {
            try
            {
                // Define the path to the wwwroot/generated-files directory
                string webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                string filePath = Path.Combine(webRootPath, "generated-files");

                // Create directory if it doesn't exist
                if (!Directory.Exists(filePath))
                {
                    Directory.CreateDirectory(filePath);
                }

                string timestamp = DateTime.Now.ToString("yyyyMMddHHmmss");
                string fileName = $"{name}_{timestamp}.html";
                string fullPath = Path.Combine(filePath, fileName);

                // Write the HTML content to the file
                using (StreamWriter writer = new StreamWriter(fullPath))
                {
                    writer.Write(htmlContent);
                }

                // Return the relative URL of the saved file
                string relativeUrl = $"/generated-files/{fileName}";

                return relativeUrl;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error saving HTML to wwwroot: {ex.Message}");
                throw;
            }
        }

        private string GetFileUrl(string filePath)
        {
            // Construct URL to access the temporary HTML file
            string fileUrl = $"file://{filePath.Replace('\\', '/')}";
            return fileUrl;
        }
        private async Task<List<Result>> GetCandidateResultsAsync(int candidateId)
        {
            try
            {
                return await _context.Result
                    .Where(r => r.CandidateId == candidateId)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving candidate results for candidateId {candidateId}: {ex.Message}");
                return new List<Result>(); // Return an empty list in case of an error
            }
        }
        private string CombineReportsIntoHtml(List<string> reportHtmls)
        {
            // Combine all HTML strings into a single HTML document with iframes
            var combinedHtmlBuilder = new StringBuilder();
            combinedHtmlBuilder.Append("<!DOCTYPE html><html><head><title>Combined Report</title></head><body>");

            foreach (var reportHtml in reportHtmls)
            {
                combinedHtmlBuilder.Append("<iframe style='width:100%; height:800px; border:none;' srcdoc='");
                combinedHtmlBuilder.Append(System.Net.WebUtility.HtmlEncode(reportHtml));
                combinedHtmlBuilder.Append("'></iframe>");
            }

            combinedHtmlBuilder.Append("</body></html>");

            return combinedHtmlBuilder.ToString();
        }

        private string InsertCandidateDataIntoHtml(string htmlTemplate, List<Result> candidateResults)
        {
            foreach (var result in candidateResults)
            {
                htmlTemplate = htmlTemplate.Replace($"{{{{{result.FieldName}}}}}", result.Value);
            }

            return htmlTemplate;
        }

private async Task<string> GenerateReport(int candidateId)
{
    try
    {
        string logMessage;

        logMessage = $"Starting report generation for candidate ID: {candidateId}";
        _logger.LogInformation(logMessage);
        Console.WriteLine(logMessage);

        // Fetch candidate results
        var candidateResults = await GetCandidateResultsAsync(candidateId);
        if (candidateResults == null)
        {
            logMessage = "Candidate results are null.";
            _logger.LogError(logMessage);
            Console.WriteLine(logMessage);
            return string.Empty;
        }

        logMessage = "Candidate results fetched successfully.";
        _logger.LogInformation(logMessage);
        Console.WriteLine(logMessage);

        // Determine the path to the HTML template based on testcode
        var candidate = await _context.Candidates.FindAsync(candidateId); // Assuming the candidate's testcode is stored in the Candidates table
        string templatePath;
        
if (candidate != null && 
    (candidate.storedTestCode == "PEX4IT2312H1003" || candidate.storedTestCode == "PEX4ITP2312H1003" || candidate.storedTestCode == "PEXHLS2312S1004"))
{
    templatePath = "/root/pexibackup/NewApp/Result2.html";
}
else
{
    templatePath = "/root/pexibackup/NewApp/Result1.html";
}

        logMessage = $"Template path: {templatePath}";
        _logger.LogInformation(logMessage);
        Console.WriteLine(logMessage);

        // Read the HTML template
        string htmlTemplate;
        if (System.IO.File.Exists(templatePath))
        {
            htmlTemplate = await System.IO.File.ReadAllTextAsync(templatePath);
            logMessage = "HTML template read successfully.";
            _logger.LogInformation(logMessage);
            Console.WriteLine(logMessage);
        }
        else
        {
            logMessage = $"Template file not found at {templatePath}";
            _logger.LogError(logMessage);
            Console.WriteLine(logMessage);
            return string.Empty;
        }

        // Insert candidate data into the template
        string modifiedHtml = InsertCandidateDataIntoHtml(htmlTemplate, candidateResults);
        logMessage = "Candidate data inserted into HTML template successfully.";
        _logger.LogInformation(logMessage);
        Console.WriteLine(logMessage);

        return modifiedHtml;
    }
    catch (Exception ex)
    {
        string logMessage = $"Error generating report for candidate ID: {candidateId}. Exception: {ex.Message}";
        _logger.LogError(logMessage);
        Console.WriteLine(logMessage);
        return string.Empty; // Return an empty string or handle error as needed
    }
}




        private async Task GetJobStream(string selectedSpecializations, string mathScience, string science, string selectedOrganisation,string selectedIndustries)
        {
            try
            {
                // Parse the selected specializations
                var specializationsList = selectedSpecializations.Split(',').ToList();
                while (specializationsList.Count < 5)
                {
                    specializationsList.Add("");
                }

                for (int i = 0; i < specializationsList.Count; i++)
                {
                    AddToResultTable("StreamJobRole", $"selectedSpecializations{i + 1}", specializationsList[i], candidateidd, "");
                }

                var industriesList = selectedIndustries.Split(',').ToList();
                while (industriesList.Count < 5)
                {
                    industriesList.Add("");
                }

                for (int i = 0; i < industriesList.Count; i++)
                {
                    AddToResultTable("StreamJobRole", $"selectedIndustries{i + 1}", industriesList[i], candidateidd, "");
                }

                // Fetch job streams based on the parsed specializations
                var jobStreams = await _context.StreamJobRole
                .Where(stream => specializationsList.Contains(stream.SecondaryStream) &&
                                 stream.HasScience == science &&
                                 (mathScience == "0" ? stream.HasMaths == "Yes" : stream.HasMaths == "No"))
                .ToListAsync();
                List<string> suggestedRoles = new List<string>();

                foreach (var jobStream in jobStreams)
                {
                    if (selectedOrganisation == "Technology & Data Robotic")
                    {
                        if (!string.IsNullOrEmpty(jobStream.JobsinTechnologyandDataRoboticFunctions))
                        {
                            suggestedRoles.AddRange(jobStream.JobsinTechnologyandDataRoboticFunctions.Split(',').Select(role => role.Trim()));
                        }
                    }
                    else if (selectedOrganisation == "Sales & Business Dev")
                    {
                        if (!string.IsNullOrEmpty(jobStream.JobsinSalesBusinessDevelopmentFunctions))
                        {
                            suggestedRoles.AddRange(jobStream.JobsinSalesBusinessDevelopmentFunctions.Split(',').Select(role => role.Trim()));
                        }
                    }
                    else if (selectedOrganisation == "Finance & Money Management")
                    {
                        if (!string.IsNullOrEmpty(jobStream.JobsinFinanceMoneyManagementFunctions))
                        {
                            suggestedRoles.AddRange(jobStream.JobsinFinanceMoneyManagementFunctions.Split(',').Select(role => role.Trim()));
                        }
                    }
                    else if (selectedOrganisation == "Product, Operations, Research, Administration, and others")
                    {
                        if (!string.IsNullOrEmpty(jobStream.JobsinProductOperationsResearchAdministrationothers))
                        {
                            suggestedRoles.AddRange(jobStream.JobsinProductOperationsResearchAdministrationothers.Split(',').Select(role => role.Trim()));
                        }
                    }
                }

                for (int i = 0; i < 5; i++)
                {
                    string role = i < suggestedRoles.Count ? suggestedRoles[i] : "";  // Check if index is within bounds
                    AddToResultTable("StreamJobRole", $"Suggestedjobrole{i + 1}", role, candidateidd, "");
                }


                // Filter based on mathScience and science

                // Filter based on selected organisation

                // Add fetched job streams to the result table

            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching job streams: {ex.Message}");
                throw;
            }
        }

	 private async Task GetTop5Motivations(string SelectedOptions, int candidateId)
        {
            try
            {
                // Parse the selected options
                var selectedOptionsList = SelectedOptions.Split(',').ToList();

                // Retrieve the motivation list by filtering the CandidateSelectedOptions table
                var motivationList = await _context.CandidateSelectedOptions
                    .Where(option => option.candidate_id == candidateId &&
                                     option.AssessmentSubAttributeId == "4B1ADD65-45B8-4E5F-A448-9E441EAD0935" &&
                                     selectedOptionsList.Contains(option.selected_option))
                    .Select(option => option.SubjectiveCorrectAnswer)
                    .ToListAsync();

                // Get the top 5 motivations
                var top5Motivations = motivationList
                    .GroupBy(m => m)
                    .OrderByDescending(g => g.Count())
                    .Select(g => g.Key)
                    .Take(5)
                    .ToList();

                // Ensure top5Motivations has exactly 5 items, fill with empty strings if less
                while (top5Motivations.Count < 5)
                {
                    top5Motivations.Add("");
                }

                // Get exactly 3 motivations (if available) to send to AddToResultTable
                var motivationsToSend = top5Motivations.Take(3).ToList();
                var motivationTypeMapping = new Dictionary<string, string>
        {
            { "Creativity/Independence", "extrinsic" },
            { "Service/Functional Excellence", "extrinsic" },
            // Default to "intrinsic" if not explicitly extrinsic
        };

                Dictionary<string, List<string>> motivationToSuggestions = new Dictionary<string, List<string>>
        {
            { "Power/Wealth creation", new List<string> { "Govt. job", "Large MNC / Manufacturing firm" } },
            { "Service/Functional Excellence", new List<string> { "Consulting firm", "Services firm", "Specialist", "Entrepreneurship" } },
            { "Social Acceptance", new List<string> { "Govt. job", "Large MNC / Manufacturing firm" } },
            { "Creative/Independence", new List<string> { "Entrepreneurship" } }
            // Add more mappings as needed
        };

                List<string> motivationSuggestions = new List<string>();

                // Add top 3 motivations to the result table
                for (int i = 0; i < motivationsToSend.Count; i++)
                {
                    string motivation = motivationsToSend[i];
                    string typeOfMotivation = motivationTypeMapping.ContainsKey(motivation) ? motivationTypeMapping[motivation] : "intrinsic";
                    AddToResultTable("StreamJobRole", $"top5Motivations{i + 1}", motivation, candidateId, "");
                    AddToResultTable("StreamJobRole", $"typeOfMotivation{i + 1}", typeOfMotivation, candidateId, "");

                    // Get suggestions for the current motivation
                    if (motivationToSuggestions.ContainsKey(motivation))
                    {
                        List<string> suggestions = motivationToSuggestions[motivation];
                        foreach (string suggestion in suggestions)
                        {
                            if (!motivationSuggestions.Contains(suggestion))
                            {
                                motivationSuggestions.Add(suggestion);
                            }
                        }
                    }
                }

                // Ensure motivationSuggestions has at least 3 items, fill with empty strings if less
                while (motivationSuggestions.Count < 3)
                {
                    motivationSuggestions.Add("");
                }

                // Add motivation suggestions to the result table
                for (int i = 0; i < motivationSuggestions.Count; i++)
                {
                    AddToResultTable("StreamJobRole", $"motivationSuggestion{i + 1}", motivationSuggestions[i], candidateId, "");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching top 5 motivations: {ex.Message}");
                throw;
            }
        }



        private async Task<(string, string, string)> GetCareerChoicesFromTemperamentTable(DateTime dob, int candidateidd)
        {
            // Initialize career choices
            string careerChoice1 = string.Empty;
            string careerChoice2 = string.Empty;
            string careerChoice3 = string.Empty;
            string TempramentComments = string.Empty;

            if (dob != default)    
            {
                // Parse dob to get month and day
                int dobMonth = dob.Month;
                int dobDay = dob.Day;

                // Fetch temperament records
                var temperamentRecords = _context.TemperamentTable.ToList();

                // Filter records based on the condition
                var temperamentRecord = temperamentRecords.FirstOrDefault(tt =>
                    (int.Parse(tt.StartMonth) < dobMonth || (int.Parse(tt.StartMonth) == dobMonth && int.Parse(tt.StartDate) <= dobDay)) &&
                    (int.Parse(tt.EndMonth) > dobMonth || (int.Parse(tt.EndMonth) == dobMonth && int.Parse(tt.EndDate) >= dobDay)));

                if (temperamentRecord != null)
                {
                    careerChoice1 = temperamentRecord.CareerChoices1;
                    careerChoice2 = temperamentRecord.CareerChoice2;
                    careerChoice3 = temperamentRecord.CareerChoice3;
                    TempramentComments = temperamentRecord.Comment;
                }

            }
            AddToResultTable("Temprament", "careerChoice1", careerChoice1, candidateidd, "");
            AddToResultTable("Temprament", "careerChoice2", careerChoice2, candidateidd, "");
            AddToResultTable("Temprament", "careerChoice3", careerChoice3, candidateidd, "");
            AddToResultTable("Temprament", "TempramentComments", TempramentComments, candidateidd, "");


            return (careerChoice1, careerChoice2, careerChoice3);
        }

        private async Task AddDataToDatabaseTable(int candidateId, DateTime dateOfBirth)
        {
            try
            {
                var candidate = await _context.Candidates.FindAsync(candidateId);
                if (candidate == null)
                {
                    throw new Exception("Candidate not found");
                }

                var age = DateTime.Now.Year - dateOfBirth.Year;
                if (DateTime.Now.DayOfYear < dateOfBirth.DayOfYear)
                {
                    age--;
                }

                var databaseEntry = new DatabaseTable
                {
                    candidate_id = candidateId,
                    name = candidate.name,
                    age = age,
                    gender = candidate.gender,
                    qualification = candidate.qualification,
                    time = DateTime.Now
                };
                AddToResultTable("CandidateDetails", "age", age, candidateidd, "");

                _context.DatabaseTable.Add(databaseEntry);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Log the exception
                _logger.LogError(ex, "An error occurred while adding data to the database");
                throw; // Rethrow the exception to maintain the original behavior
            }
        }
        private string selectedOrganisation;

        private async Task MapAnswerIdToIIAFitmentAsync()
        {
            var result = new Dictionary<string, (int Count, string IIAFitment)>();

            // Retrieve the AnswerId and corresponding IIAFitment for each option
            var answers = await _context.InterestAnswersIIA
                .Where(a => optionsList.Contains(a.AnswerId))
                .ToListAsync();

            foreach (var answer in answers)
            {
                if (result.ContainsKey(answer.PrimaryIndustryId))
                {
                    var (count, iiaFitment) = result[answer.PrimaryIndustryId];
                    result[answer.PrimaryIndustryId] = (count + 1, iiaFitment);
                }
                else
                {
                    result[answer.PrimaryIndustryId] = (1, answer.IIAFitment);
                }
            }
            var top3PrimaryIndustryIds = result
                .OrderByDescending(r => r.Value.Count)
                .Take(3)
                .Select(r => r.Key)
                .ToList();

            // Sort the result by count in descending order
            var sortedResult = result.OrderByDescending(r => r.Value.Count);
            PrimaryIndustryIds.AddRange(top3PrimaryIndustryIds);


            // Take the top 3 IIAFitment
            var top3IIAFitment = sortedResult.Take(3).Select(r => r.Value.IIAFitment).ToList();
           


            string IIAFitment1 = top3IIAFitment.Count > 0 ? top3IIAFitment[0] : string.Empty;
            string IIAFitment2 = top3IIAFitment.Count > 1 ? top3IIAFitment[1] : string.Empty;
            string IIAFitment3 = top3IIAFitment.Count > 2 ? top3IIAFitment[2] : string.Empty;
            AddToResultTable("IIAFitment", "IIAFitment1", IIAFitment1, candidateidd, "");
            AddToResultTable("IIAFitment", "IIAFitment2", IIAFitment2, candidateidd, "");
            AddToResultTable("IIAFitment", "IIAFitment3", IIAFitment3, candidateidd, "");
        }



        private async Task SubIndustries()
        {
            var subIndustriesData = new List<(string Ind1, string Ind2, string Ind3, string Ind4, string Ind5)>();

            // Retrieve the IIAFitment and corresponding Ind1, Ind2, Ind3, Ind4, Ind5 for each primary industry ID
            var subIndustries = await _context.IIAIndustriessub
                .Where(a => PrimaryIndustryIds.Contains(a.Id))
                .ToListAsync();

            foreach (var subIndustry in subIndustries)
            {
                var ind1 = subIndustry.Ind1;
                var ind2 = subIndustry.Ind2;
                var ind3 = subIndustry.Ind3;
                var ind4 = subIndustry.Ind4;
                var ind5 = subIndustry.Ind5;

                // Do something with the retrieved data, such as adding it to a list
                subIndustriesData.Add((ind1, ind2, ind3, ind4, ind5));
            }

            // Here, you can utilize the subIndustriesData list or perform any other required operations.

            // Iterate over subIndustriesData and add the data to the result table
            for (int i = 0; i < subIndustriesData.Count; i++)
            {
                var subIndustryData = subIndustriesData[i];
                AddToResultTable("IIAFitment", $"IIAFitment{i + 1}sub1", subIndustryData.Ind1, candidateidd, "");
                AddToResultTable("IIAFitment", $"IIAFitment{i + 1}sub2", subIndustryData.Ind2, candidateidd, "");
                AddToResultTable("IIAFitment", $"IIAFitment{i + 1}sub3", subIndustryData.Ind3, candidateidd, "");
                AddToResultTable("IIAFitment", $"IIAFitment{i + 1}sub4", subIndustryData.Ind4, candidateidd, "");
                AddToResultTable("IIAFitment", $"IIAFitment{i + 1}sub5", subIndustryData.Ind5, candidateidd, "");
            }
        }
        List<string> PrimaryIndustryIds = new List<string>();
        List<string> optionsList = new List<string>();

        private List<string> GetSelectedOptionsList(int candidateId, string name, string selectedOptions, string testProgress, int rating, DateTime dateOfBirth,string mathscience)

{
            string candidateMathScience = mathscience;
    // Initialize an empty list to store selected options
  


    // Check the testProgress value
    if (rating > 0)
    {
        // Split the selectedOptions string into a list of distinct options
        optionsList = selectedOptions.Split(',').Distinct().ToList();



        // Get the list of existing options for the candidate
        var existingOptions = _context.CandidateSelectedOptions
            .Where(c => c.candidate_id == candidateId)
            .Select(c => c.selected_option)
            .ToHashSet();
              
                // Insert selected options into CandidateSelectedOptions table
                foreach (var option in optionsList)
        {
            // Check if the option already exists in the database for the given candidate
            if (!existingOptions.Contains(option))
            {
                var questionMap = _context.QuestionAnsMaps.FirstOrDefault(q => q.AnswerId == option);
                if (questionMap != null)
                {
                    // Retrieve SubjectiveCorrectAnswer for the current option
                    var subjectiveCorrectAnswer = questionMap.SubjectiveCorrectAnswer;

                    var totalQuestion = _context.TotalQuestions.FirstOrDefault(tq => tq.QuestionId == questionMap.QuestionId);
                    if (totalQuestion != null)
                    {
                        // Fetch report sub-attribute information again based on the new AssessmentSubAttributeId
                        var reportSubAttributeInfo = _context.ReportSubAttributes
                            .Where(rsa => rsa.AssessmentSubAttributeId == totalQuestion.AssessmentSubAttributeId)
                            .Select(rsa => new
                            {
                                AssessmentSubAttribute = rsa.AssessmentSubAttribute,
                                CountofQuestiontoDisplay = rsa.CountofQuestiontoDisplay
                            })
                            .FirstOrDefault();

                        if (reportSubAttributeInfo != null)
                        {
                            var candidateOption = new CandidateSelectedOptions
                            {
                                candidate_id = candidateId,
                                candidate_name = name,
                                selected_option = option,
                                question_id = questionMap.QuestionId.ToString(),
                                maxmarks = questionMap.MarksTotal,
                                AssessmentSubAttributeId = totalQuestion.AssessmentSubAttributeId,
                                AssessmentSubAttribute = reportSubAttributeInfo.AssessmentSubAttribute,
                                CountofQuestiontoDisplay = reportSubAttributeInfo.CountofQuestiontoDisplay,
                                SubjectiveCorrectAnswer = subjectiveCorrectAnswer // Assign the fetched SubjectiveCorrectAnswer directly
                            };

                            _context.CandidateSelectedOptions.Add(candidateOption);
                        }

                    }
                }
            }
        }

        // Save changes to the database
        _context.SaveChanges();
                string[] desiredSequence = {
    "Morality", "Emotional Stability",
    "Creativity", "Openness to Learning", "Fight vs. Flight", "Comprehension",
    "Workplace communication", "Resourcefulness", "Logical thinking", "Numeracy",
    "Situational Judgment", "Motivation", "Interests", "Handling Conflict",
    "Self Esteem", "Team Management", "Negotiation", "Role", "Needs",
    "Responsibility", "Goal", "Integrity", "Income Dependency"
};

                    var assessmentResults = _context.CandidateSelectedOptions
            .Where(c => c.candidate_id == candidateId)
            .GroupBy(c => new { c.candidate_id, c.candidate_name, c.AssessmentSubAttributeId, c.AssessmentSubAttribute, c.CountofQuestiontoDisplay })
            .Select(g => new
            {
                candidate_id = g.Key.candidate_id,
                candidate_name = g.Key.candidate_name,
                AssessmentSubAttributeId = g.Key.AssessmentSubAttributeId,
                AssessmentSubAttribute = g.Key.AssessmentSubAttribute,
                sumofmarks = g.Sum(c => c.maxmarks),
                CountofQuestiontoDisplay = g.Key.CountofQuestiontoDisplay,
                total_marks = new[] {
                    "3FF4087B-F429-403E-97DF-728FF3908212", "310594A1-EDE4-406E-AEF2-BF2F5673A50F", "DD2B0C9C-0E3C-47E1-9A0E-4CBF4CEF3733", "72128D6A-65A3-4EE4-A100-C4D238CB8DBC",
                    "D29F579D-A526-4A36-B3E6-9E167E0E63CB", "66BC31EE-1DA1-4D7C-9760-24B92BF77FEE", "941C4297-2DFC-47A2-8E04-518397BEC4B0", "3F7D1B78-B3F4-47B2-9644-16BA92448EAB",
                    "94695DAD-CFCE-4DD1-ABE9-D21D97862977", "1E44BAA0-5E58-4AA8-BB2A-2984D9BA7339", "39878094-3EE3-46E5-A454-C87E9D3BAC06", "246EF52C-A8D1-4123-B484-44D7A08BDF2D",
                    "9F82C4CA-2A91-40B3-BBFD-4E3835A82F5A", "80B7BFE2-F1AA-42A2-B603-77BD843BD985", "911B2029-4BB0-4A0B-9F65-2A3FC9B9512C", "585C2875-E838-497D-9823-C3B8538957FC",
                    "AB0D3C3E-7266-4428-97B6-B2D9C26D7D64", "7995E60C-6A68-448A-AA05-814EF8D0F847", "F7F74CD9-A098-45DB-A4B5-43CC21582278", "8504732E-DD08-4ED2-A9E9-F2D8ED35E6A8",
                    "A7AF3B8D-B8DD-4358-BA71-46F2C4DC5EF9", "508DC172-DA29-469F-B353-391995799A38", "E37B82D6-01B8-44E6-AA08-245B5EDCEAD1", "0434DA6B-AA3F-493A-9206-F2B93A824FBD",
                    "4F84318B-BE58-4E31-B9D9-CBC5C40E779A", "7F6D1495-9D09-4549-B82C-0E08871E7730", "CD4759EF-CEE7-4769-A940-894571FDA4E0", "FBC6DEA7-A284-4E07-B49C-8ED12E4B8D70",
                    "569E6876-4D05-4566-A43B-94A8E28D3EEA", "DA1339AB-8AAB-4D46-B789-EF785E991A1C", "9B518D9C-755A-4D0A-A010-665BB4B52C8F", "A3961DAA-5271-4A2B-B779-74AC956E82BC",
                    "671F43B8-0379-4721-9BEC-4D3598E2BB55", "89B32E9A-2F4E-48F0-B0A8-1967C9CADD20", "2140835F-6F90-4112-A6CE-2F837F4A4ABD", "625E7090-9828-4E61-B4F8-4AAB863B5714",
                    "F41123F4-37AC-4EC5-AB4C-BEE1715408BD", "F7BA38BA-EFA4-472F-A70D-23F1D537E206", "294F49B4-B02E-4C80-ACF1-AF060DE1382C", "2DEB1EA6-060D-4D5C-BE43-C945004A08B4",
                    "36E8D2D9-75BF-49C6-8028-B538E954AD5A", "CE33B73B-CAE9-4011-B631-9CC8A922DFD3", "51B65867-5243-4846-A205-BD940E299C69", "A29808AF-E025-4756-803D-274FF0E3EE42",
                    "4E0BCCA3-E4F8-48D9-BACB-8D7AAA9BB209", "D5EEB76E-597E-4482-BFC9-D9D0D5BCC15C", "3CBFAF9C-D9B5-4FD3-AE29-E3AF9FCE7A33", "AA8CD5EC-062B-4745-A29D-167E1228920E",
                    "0ABBA87C-C943-475E-A67F-CC1B199D98E2", "7C2AE8FA-F950-4BEB-876C-DF548AD82ACB", "03CFCA9E-3F37-4445-BE22-85DF99BD1F1E", "A171535D-0266-4AD3-A361-0D70D1426F2F",
                    "A6B7F6BD-EC7D-4C5C-AD22-A25B7390E77D", "D4011B41-7FB3-4C6C-9720-9E74BC9471A0", "29581FF7-F7DE-429E-8572-94208DD8FC60"
                }.Contains(g.Key.AssessmentSubAttributeId) ? g.Key.CountofQuestiontoDisplay * 5 : g.Key.CountofQuestiontoDisplay * 4,
                percentage = (g.Sum(c => c.maxmarks) / (new[] {
                    "3FF4087B-F429-403E-97DF-728FF3908212", "310594A1-EDE4-406E-AEF2-BF2F5673A50F", "DD2B0C9C-0E3C-47E1-9A0E-4CBF4CEF3733", "72128D6A-65A3-4EE4-A100-C4D238CB8DBC",
                    "D29F579D-A526-4A36-B3E6-9E167E0E63CB", "66BC31EE-1DA1-4D7C-9760-24B92BF77FEE", "941C4297-2DFC-47A2-8E04-518397BEC4B0", "3F7D1B78-B3F4-47B2-9644-16BA92448EAB",
                    "94695DAD-CFCE-4DD1-ABE9-D21D97862977", "1E44BAA0-5E58-4AA8-BB2A-2984D9BA7339", "39878094-3EE3-46E5-A454-C87E9D3BAC06", "246EF52C-A8D1-4123-B484-44D7A08BDF2D",
                    "9F82C4CA-2A91-40B3-BBFD-4E3835A82F5A", "80B7BFE2-F1AA-42A2-B603-77BD843BD985", "911B2029-4BB0-4A0B-9F65-2A3FC9B9512C", "585C2875-E838-497D-9823-C3B8538957FC",
                    "AB0D3C3E-7266-4428-97B6-B2D9C26D7D64", "7995E60C-6A68-448A-AA05-814EF8D0F847", "F7F74CD9-A098-45DB-A4B5-43CC21582278", "8504732E-DD08-4ED2-A9E9-F2D8ED35E6A8",
                    "A7AF3B8D-B8DD-4358-BA71-46F2C4DC5EF9", "508DC172-DA29-469F-B353-391995799A38", "E37B82D6-01B8-44E6-AA08-245B5EDCEAD1", "0434DA6B-AA3F-493A-9206-F2B93A824FBD",
                    "4F84318B-BE58-4E31-B9D9-CBC5C40E779A", "7F6D1495-9D09-4549-B82C-0E08871E7730", "CD4759EF-CEE7-4769-A940-894571FDA4E0", "FBC6DEA7-A284-4E07-B49C-8ED12E4B8D70",
                    "569E6876-4D05-4566-A43B-94A8E28D3EEA", "DA1339AB-8AAB-4D46-B789-EF785E991A1C", "9B518D9C-755A-4D0A-A010-665BB4B52C8F", "A3961DAA-5271-4A2B-B779-74AC956E82BC",
                    "671F43B8-0379-4721-9BEC-4D3598E2BB55", "89B32E9A-2F4E-48F0-B0A8-1967C9CADD20", "2140835F-6F90-4112-A6CE-2F837F4A4ABD", "625E7090-9828-4E61-B4F8-4AAB863B5714",
                    "F41123F4-37AC-4EC5-AB4C-BEE1715408BD", "F7BA38BA-EFA4-472F-A70D-23F1D537E206", "294F49B4-B02E-4C80-ACF1-AF060DE1382C", "2DEB1EA6-060D-4D5C-BE43-C945004A08B4",
                    "36E8D2D9-75BF-49C6-8028-B538E954AD5A", "CE33B73B-CAE9-4011-B631-9CC8A922DFD3", "51B65867-5243-4846-A205-BD940E299C69", "A29808AF-E025-4756-803D-274FF0E3EE42",
                    "4E0BCCA3-E4F8-48D9-BACB-8D7AAA9BB209", "D5EEB76E-597E-4482-BFC9-D9D0D5BCC15C", "3CBFAF9C-D9B5-4FD3-AE29-E3AF9FCE7A33", "AA8CD5EC-062B-4745-A29D-167E1228920E",
                    "0ABBA87C-C943-475E-A67F-CC1B199D98E2", "7C2AE8FA-F950-4BEB-876C-DF548AD82ACB", "03CFCA9E-3F37-4445-BE22-85DF99BD1F1E", "A171535D-0266-4AD3-A361-0D70D1426F2F",
                    "A6B7F6BD-EC7D-4C5C-AD22-A25B7390E77D", "D4011B41-7FB3-4C6C-9720-9E74BC9471A0", "29581FF7-F7DE-429E-8572-94208DD8FC60"
                }.Contains(g.Key.AssessmentSubAttributeId) ? g.Key.CountofQuestiontoDisplay * 5 : g.Key.CountofQuestiontoDisplay * 4)) * 100
            }).AsEnumerable() // Fetch data into memory
    .OrderBy(g =>
    {
        var index = Array.IndexOf(desiredSequence, g.AssessmentSubAttribute);
        return index == -1 ? int.MaxValue : index;
    })
    .ToList();


                var bechcomenData = _context.bechcomen
                    .Select(b => new {
                        b.ReportSubAttributeId,
                        b.Score,
                        b.Grade,
                       // No default value here, handle it in the logic
                        b.Comments2
                    })
                    .ToList();
                // Fetch Benchmark Data
                var BenchmarkData = _context.benchmarkmodel
                    .Select(b => new // Select and transform each object with all properties
                    {
                        MatrixNew = b.Matrix_new,
                        SubAttributeNew = b.SubAttribute_new,
                        LessThanEqual13_new = b.LessThanEqual13_new,
                        Seventeen_new = b.Seventeen_new,
                        Eighteen_new = b.Eighteen_new,
                        Nineteen_new = b.Nineteen_new,
                        Twenty_new = b.Twenty_new,
                        TwentyOne_new = b.TwentyOne_new,
                        TwentyTwoToTwentyFour_new = b.TwentyTwoToTwentyFour_new,
                        TwentyFiveToTwentyNine_new = b.TwentyFiveToTwentyNine_new,
                        ThirtyToThirtyNine_new = b.ThirtyToThirtyNine_new,
                        FortyToFortyNine_new = b.FortyToFortyNine_new,
                        FiftyPlus_new = b.FiftyPlus_new,
                        GrandTotal_new = b.GrandTotal_new,
                        LessThanEqual15_new = b.LessThanEqual15_new,
                        SixteenToEighteen_new = b.SixteenToEighteen_new,
                        NineteenToTwentyOne_new = b.NineteenToTwentyOne_new
                    }).ToList();

                var age = DateTime.Now.Year - dateOfBirth.Year;
                if (DateTime.Now.DayOfYear < dateOfBirth.DayOfYear)
                {
                    age--;
                }

                // Insert aggregated data into the AssessmentResults table
                var matrixToAssessmentSubAttributeMap = new Dictionary<string, Dictionary<string, (double Sum, int Count)>>();
                // Dictionary to track percentages for each ReportSubattribute
                var reportSubAttributeToPercentageMap = new Dictionary<string, (double Sum, int Count)>();
                foreach (var result in assessmentResults)
                {
                    // Retrieve the matrix and ReportSubAttributeId for the current AssessmentSubAttributeId
                    var reportSubAttribute = _context.ReportSubAttributes
                        .Where(r => r.AssessmentSubAttributeId == result.AssessmentSubAttributeId)
                        .Select(r => new
                        {
                            r.Matrix,
                            r.ReportSubAttributeId,
                            r.ReportSubattribute
                        })
                        .FirstOrDefault();

                    // Group AssessmentResults data by ReportSubAttributeId and calculate the average percentage for each group


                   
                    // Find the corresponding benchmark entry based on the average percentage and ReportSubAttributeId


                    // Initialize or update the percentage map for the ReportSubattribute
                    if (reportSubAttribute != null)
                    {
                        if (!reportSubAttributeToPercentageMap.ContainsKey(reportSubAttribute.ReportSubattribute))
                        {
                            reportSubAttributeToPercentageMap[reportSubAttribute.ReportSubattribute] = (result.percentage, 1);
                        }
                        else
                        {
                            var current = reportSubAttributeToPercentageMap[reportSubAttribute.ReportSubattribute];
                            reportSubAttributeToPercentageMap[reportSubAttribute.ReportSubattribute] = (current.Sum + result.percentage, current.Count + 1);
                        }
                    }

		

                    // Create a new AssessmentResults entry
                    var assessmentResult = new AssessmentResults
                    {
                        candidate_id = result.candidate_id,
                        candidate_name = result.candidate_name,
                        AssessmentSubAttributeId = result.AssessmentSubAttributeId,
                        AssessmentSubAttribute = result.AssessmentSubAttribute,
                        sumofmarks = result.sumofmarks,
                        CountofQuestiontoDisplay = result.CountofQuestiontoDisplay,
                        total_marks = result.total_marks,
                    // Updated with the average later
                        Matrix = reportSubAttribute?.Matrix,
                        ReportSubAttributeId = reportSubAttribute?.ReportSubAttributeId,
                        ReportSubattribute = reportSubAttribute?.ReportSubattribute,
                      // Add Comments2 from benchmark
                    };

                    // If a matching benchmark entry is found, log the Comments2
                

                    if (reportSubAttribute != null)
                    {
                        // Initialize or update the sub-attribute map for the matrix
                        if (!matrixToAssessmentSubAttributeMap.ContainsKey(reportSubAttribute.Matrix))
                        {
                            matrixToAssessmentSubAttributeMap[reportSubAttribute.Matrix] = new Dictionary<string, (double Sum, int Count)>();
                        }

                        var subAttributeMap = matrixToAssessmentSubAttributeMap[reportSubAttribute.Matrix];

                        // Initialize or update the sum and count for the sub-attribute
                        if (!subAttributeMap.ContainsKey(result.AssessmentSubAttribute))
                        {
                            subAttributeMap[result.AssessmentSubAttribute] = (result.percentage, 1);
                        }
                        else
                        {
                            var current = subAttributeMap[result.AssessmentSubAttribute];
                            subAttributeMap[result.AssessmentSubAttribute] = (current.Sum + result.percentage, current.Count + 1);
                        }
                    }

                    // Add the new assessmentResult to the context
                    _context.AssessmentResults.Add(assessmentResult);
                }

                // Calculate average percentage for each ReportSubattribute
             var averageReportSubAttributePercentages = new Dictionary<string, double>();

foreach (var reportSubAttribute in reportSubAttributeToPercentageMap.Keys)
{
    var entry = reportSubAttributeToPercentageMap[reportSubAttribute];
    var averagePercentage = Math.Round(entry.Sum / entry.Count, 0);
        averageReportSubAttributePercentages[reportSubAttribute] = averagePercentage;
}

                // Update the percentage in AssessmentResults with the average percentage for each ReportSubattribute

 void UpdateAveragePercentageWithModifiedMarks(string reportSubAttribute, List<string> assessmentIds)
              {
                    if (averageReportSubAttributePercentages.ContainsKey(reportSubAttribute))
                    {
                        double totalPercentage = 0;
                        int count = 0;

                        // Iterate over the results, modify sumofmarks and recalculate percentage
                        foreach (var result in assessmentResults.Where(r => assessmentIds.Contains(r.AssessmentSubAttributeId)))
                        {
                            // Update sumofmarks by subtracting it from 4
                            double updatedSumOfMarks = 4 - result.sumofmarks ;

                            // Ensure updatedSumOfMarks is not negative
                            if (updatedSumOfMarks < 0)
                            {
                                updatedSumOfMarks = 0;
                            }

                            // Recalculate the percentage with the updated sumofmarks
                            double updatedPercentage = (updatedSumOfMarks / result.total_marks) * 100;

                            // Accumulate the recalculated percentage
                            totalPercentage += updatedPercentage;
                            count++;
                        }

                        // Ensure that count is not zero to avoid division by zero
                        if (count > 0)
                        {
                            double avgPercentageOfIds = totalPercentage / count;

                            // Get the current average percentage for the reportSubAttribute
                            var currentAveragePercentage = averageReportSubAttributePercentages[reportSubAttribute];

                            // Update the reportSubAttribute's averagePercentage by subtracting the avgPercentageOfIds
                            var updatedPercentage = (currentAveragePercentage + avgPercentageOfIds)/2;


                            // Update the dictionary with the new value
                            averageReportSubAttributePercentages[reportSubAttribute] = updatedPercentage;

                            Console.WriteLine($"Updated average percentage for '{reportSubAttribute}': {updatedPercentage}");
                        }
                        else
                        {
                            Console.WriteLine($"No matching AssessmentSubAttributeIds found for {reportSubAttribute}.");
                        }
                    }
                }

                // Example Usage
                string testCode = "PEX4IT2312H1003";
 if (testCode == "PEX4IT2312H1003" && testCode == "PEXHLS2312S1004")
                {
                    // Update Goal
                    UpdateAveragePercentageWithModifiedMarks("Goal", new List<string>

			   {
        "E1B53C7C-0DE2-4F54-B107-022703A7E837",
        "501FF2F1-FA8D-4553-BA42-5C23FAE921F8",
        "601E5952-DEF7-4DB1-945E-042F3B21DB90",
        "9D98B4D1-B188-4C75-B8B5-472284289BC4"
    });

                    // Update Needs
                    UpdateAveragePercentageWithModifiedMarks("Needs", new List<string>
    {
        "DA1B527C-98E6-4F09-8017-720FC8735D11",
        "34962CC6-68AC-4127-B5CD-D50FD3142912",
        "08B1E419-7A6A-4C98-BA0E-F9CBEB6005C0",
        "EB89E13C-E8E3-40A1-BC5B-42D350DC35CE"
    });

                    // Update Responsibility
                    UpdateAveragePercentageWithModifiedMarks("Responsibility", new List<string>
    {
        "5AA3738A-DED8-4CF4-9932-E942CB53C7F8",
        "D441F8A0-0EE8-4D60-97F2-CD5CB1941F59",
        "970826E2-999A-4F15-B58A-8A87C72E019E",
        "9DA21725-16B9-4E5C-BDFB-BECF3D054B69"
    });
                    UpdateAveragePercentageWithModifiedMarks("Role", new List<string>
    {
        "324C72F3-9E12-4AA3-BEA8-7137B0B37917",
        "6093606F-1557-43E1-A944-A295E1C3B5E7",
        "11203660-06D9-4E08-93B6-9DBC0837771E",
        "E003F38F-0F63-4C58-B783-9DE523DAA4A4"
    });
                }

                var matrixAverages = new Dictionary<string, double>();

                foreach (var matrix in matrixToAssessmentSubAttributeMap.Keys)
                {
                    var subAttributes = matrixToAssessmentSubAttributeMap[matrix];
                    double totalSum = 0;
                    int totalCount = 0;

                    foreach (var subAttribute in subAttributes.Values)
                    {
                        totalSum += subAttribute.Sum;
                        totalCount += subAttribute.Count;
                    }

                    if (totalCount > 0)
                    {
                        matrixAverages[matrix] = Math.Round(totalSum / totalCount, 0);
                    }
                }

                // Save changes to the context
                _context.SaveChanges();

                // Add average percentage values to the result table
                var processedReportSubAttributes = new HashSet<string>();
                int i = 1;
                var matrixPercentiles = new Dictionary<string, List<double>>();
                foreach (var kvp in averageReportSubAttributePercentages)
                {
                    var reportSubAttribute = kvp.Key;
                    var averagePercentage = kvp.Value;
                    string benchmarkValue = null;

                   
                       
                         
                            // Fetch the benchmark value based on age
                            benchmarkValue = BenchmarkData
                                .Where(b => b.SubAttributeNew == reportSubAttribute)
                                .Select(b => age <= 13 ? b.LessThanEqual13_new :
                                             age <= 17 ? b.Seventeen_new :
                                             age == 18 ? b.Eighteen_new :
                                             age == 19 ? b.Nineteen_new :
                                             age == 20 ? b.Twenty_new :
                                             age == 21 ? b.TwentyOne_new :
                                             age <= 24 ? b.TwentyTwoToTwentyFour_new :
                                             age <= 29 ? b.TwentyFiveToTwentyNine_new :
                                             age <= 39 ? b.ThirtyToThirtyNine_new :
                                             age <= 49 ? b.FortyToFortyNine_new :
                                                         b.FiftyPlus_new)
                                .FirstOrDefault();

                    var matrixToReportSubAttributes = new Dictionary<string, Dictionary<string, double>>();
                    if (double.TryParse(benchmarkValue, out double benchmarkValueDouble))
                    {
                        benchmarkValue = Math.Round(benchmarkValueDouble, 0).ToString();
                    }
                    // Calculate percentile value (reportSubAttributeValue / benchmarkValue)
                    double percentile = 0;
                   
                        percentile = (averagePercentage / benchmarkValueDouble) * 10;
                    if (percentile > 10)
                    {
                        percentile = 10;
                    }// Calculate as percentage


                    // Check if the reportSubAttribute has already been processed
                    if (!processedReportSubAttributes.Contains(reportSubAttribute))
                    {
                        // Add the reportSubAttribute to the processed set
                        processedReportSubAttributes.Add(reportSubAttribute);

                        var matrix = _context.ReportSubAttributes
                            .Where(b => b.ReportSubattribute == reportSubAttribute)
                            .Select(b => b.Matrix)
                            .FirstOrDefault();
                        if (!matrixToReportSubAttributes.ContainsKey(matrix))
                        {
                            matrixToReportSubAttributes[matrix] = new Dictionary<string, double>();
                        }

                        matrixToReportSubAttributes[matrix][reportSubAttribute] = averagePercentage;
                        // Fetch all Benchmark entries corresponding to the reportSubAttribute
                        var benchmarkEntries = _context.bechcomen
                            .Where(b => b.ReportSubattribute == reportSubAttribute)
                            .ToList(); // Execute the query to retrieve data from the database

                        // Filter the benchmark entries based on the percentage range
                        var filteredBenchmarkEntries = benchmarkEntries
                            .Where(b => IsPercentageInRange(averagePercentage, b.Score))
                            .ToList(); // Execute the filtering in memory
                         
                        // Update AssessmentResults with the score from the benchmark entry
                        foreach (var filteredBenchmarkEntry in filteredBenchmarkEntries)
                        {
                            var percentage = (decimal)averagePercentage;
                            var Score = filteredBenchmarkEntry.Score;
                            var Grade = filteredBenchmarkEntry.Grade;
                            var Comments2 = filteredBenchmarkEntry.Comments2;

			    if (averagePercentage == 100)
                            {
                                averagePercentage = 95;
                            }
                            else if (averagePercentage == 0)
                            {
                                averagePercentage = 5;
                            }

                            AddToResultTable("AssessmentResult", $"reportSubAttributeName{i}", reportSubAttribute, candidateId, "");
                            AddToResultTable("AssessmentResult", $"reportSubAttributeValue{i}", averagePercentage.ToString(), candidateId, "");
                            AddToResultTable("AssessmentResult", $"Score{i}", Score.ToString(), candidateId, "");
                            AddToResultTable("AssessmentResult", $"Grade{i}", Grade.ToString(), candidateId, "");
                            AddToResultTable("AssessmentResult", $"Comment{i}", Comments2.ToString(), candidateId, "");
                            AddToResultTable("AssessmentResult", $"matrix{i}", matrix, candidateId, "");
                            AddToResultTable("Benchmark", $"benchmarkvalue{i}", benchmarkValue, candidateId, "");
                            AddToResultTable("AssessmentResult", $"percentile{i}", percentile.ToString("F2"), candidateId, "");
                            if (!matrixPercentiles.ContainsKey(matrix))
                            {
                                matrixPercentiles[matrix] = new List<double>();
                            }
                            matrixPercentiles[matrix].Add(percentile);

                            i++;
                        }
                    }
                }
                foreach (var matrix in matrixPercentiles.Keys)
                {
                    double totalPercentile = matrixPercentiles[matrix].Average();
                    if (totalPercentile > 10)
                    {
                        totalPercentile = 10;
                    }// Calculate as percentage


                    AddToResultTable("AssessmentResult", $"totalPercentile{matrix}", totalPercentile.ToString("F2"), candidateId, "");
                }
                foreach (var kvp in matrixAverages)
                {
                    var matrix = kvp.Key;
                    var average = kvp.Value;

                    AddToResultTable("AssessmentResult", $"matrixTotal_{matrix}", average.ToString(), candidateId, "");
                }
                _context.SaveChanges();

                // Calculate average percentage for each sub-attribute in each matrix and adjust with benchmark data
                var averagePercentages = new Dictionary<string, Dictionary<string, double>>();

                foreach (var matrix in matrixToAssessmentSubAttributeMap.Keys)
                {
                    foreach (var subAttribute in matrixToAssessmentSubAttributeMap[matrix].Keys)
                    {
                        var entry = matrixToAssessmentSubAttributeMap[matrix][subAttribute];
                        var averagePercentage = entry.Sum / entry.Count;

                        // Fetch the benchmark value based on age
                        var benchmarkValue = BenchmarkData
                            .Where(b => b.MatrixNew == matrix && b.SubAttributeNew == subAttribute)
                            .Select(b => age <= 13 ? b.LessThanEqual13_new :
                                         age <= 17 ? b.Seventeen_new :
                                         age == 18 ? b.Eighteen_new :
                                         age == 19 ? b.Nineteen_new :
                                         age == 20 ? b.Twenty_new :
                                         age == 21 ? b.TwentyOne_new :
                                         age <= 24 ? b.TwentyTwoToTwentyFour_new :
                                         age <= 29 ? b.TwentyFiveToTwentyNine_new :
                                         age <= 39 ? b.ThirtyToThirtyNine_new :
                                         age <= 49 ? b.FortyToFortyNine_new :
                                                     b.FiftyPlus_new)
                            .FirstOrDefault();

                        if (!string.IsNullOrEmpty(benchmarkValue))
                        {
                            // Convert benchmark value to double if necessary
                            if (double.TryParse(benchmarkValue, out var benchmarkDouble))
                            {
                                averagePercentage -= benchmarkDouble;
                            }
                        }

                        if (!averagePercentages.ContainsKey(matrix))
                        {
                            averagePercentages[matrix] = new Dictionary<string, double>();
                        }
                        averagePercentages[matrix][subAttribute] = averagePercentage;

                        Console.WriteLine($"Matrix: {matrix}, SubAttribute: {subAttribute}, Adjusted Average Percentage: {averagePercentage}");
                    

                    }
                }

                // Log the average percentage for each ReportSubattribute
                foreach (var reportSubAttribute in averageReportSubAttributePercentages.Keys)
                {
                    var averagePercentage = averageReportSubAttributePercentages[reportSubAttribute];
                    Console.WriteLine($"ReportSubattribute: {reportSubAttribute}, Average Percentage: {averagePercentage}");
                }


                // Define the sub-attribute categories
                var salesAndBusinessDevSubAttributes = new[] { "Emotional Stability", "Fight vs. Flight", "Resourcefulness", "Situational Judgment", "Negotiation", "Self Esteem" };
                var financeAndMoneyManagementSubAttributes = new[] { "Morality", "Logical thinking", "Numeracy", "Situational Judgment", "Decision Making", "Handling Conflict" };
                var technologyAndDataRoboticSubAttributes = new[] { "Openness to Learning", "Logical thinking", "Numeracy", "Resourcefulness", "Openness", "Team Management" };

                // Calculate the total average for each category
                var totalAverageSalesAndBusinessDev = 0.0;
                var totalAverageFinanceAndMoneyManagement = 0.0;
                var totalAverageTechnologyAndDataRobotic = 0.0;
                var countSalesAndBusinessDev = 0;
                var countFinanceAndMoneyManagement = 0;
                var countTechnologyAndDataRobotic = 0;

                foreach (var matrix in averagePercentages.Keys)
                {
                    foreach (var subAttribute in averagePercentages[matrix].Keys)
                    {
                        var adjustedAveragePercentage = averagePercentages[matrix][subAttribute];

                        if (salesAndBusinessDevSubAttributes.Contains(subAttribute))
                        {
                            totalAverageSalesAndBusinessDev += adjustedAveragePercentage;
                            countSalesAndBusinessDev++;
                        }

                        if (financeAndMoneyManagementSubAttributes.Contains(subAttribute))
                        {
                            totalAverageFinanceAndMoneyManagement += adjustedAveragePercentage;
                            countFinanceAndMoneyManagement++;
                        }

                        if (technologyAndDataRoboticSubAttributes.Contains(subAttribute))
                        {
                            totalAverageTechnologyAndDataRobotic += adjustedAveragePercentage;
                            countTechnologyAndDataRobotic++;
                        }
                    }
                }

                var overallAverageSalesAndBusinessDev = countSalesAndBusinessDev > 0 ? totalAverageSalesAndBusinessDev / countSalesAndBusinessDev : 0;
                var overallAverageFinanceAndMoneyManagement = countFinanceAndMoneyManagement > 0 ? totalAverageFinanceAndMoneyManagement / countFinanceAndMoneyManagement : 0;
                var overallAverageTechnologyAndDataRobotic = countTechnologyAndDataRobotic > 0 ? totalAverageTechnologyAndDataRobotic / countTechnologyAndDataRobotic : 0;

                Console.WriteLine($"Overall Average Sales & Business Dev: {overallAverageSalesAndBusinessDev}");
                Console.WriteLine($"Overall Average Finance & Money Management: {overallAverageFinanceAndMoneyManagement}");
                Console.WriteLine($"Overall Average Technology & Data Robotic: {overallAverageTechnologyAndDataRobotic}");

                // Assume candidateMathScience is a string that can be "yes" or "no"
            // Replace with actual value
                 selectedOrganisation = "Product, Operations, Research, Administration, and others";

                if (candidateMathScience == "yes")
                {
                    if (overallAverageTechnologyAndDataRobotic > 3)
                    {
                        selectedOrganisation = "Technology & Data Robotic";
                    }
                }
                else
                {
                    if (overallAverageSalesAndBusinessDev > 3)
                    {
                        selectedOrganisation = "Sales & Business Dev";
                    }
                    else if (overallAverageFinanceAndMoneyManagement > 3)
                    {
                        selectedOrganisation = "Finance & Money Management";
                    }
                    else if (overallAverageTechnologyAndDataRobotic > 3)
                    {
                        selectedOrganisation = "Technology & Data Robotic";
                    }
                }
                var candidateDetailsRecords = _context.Set<CandidateDetails>()
                          .Where(c => c.candidate_id == candidateId)
                          .ToList();

                Console.WriteLine($"Selected Organisation: {selectedOrganisation}");
                AddToResultTable( "Benchmark", "BenchMarkOrganisation", selectedOrganisation, candidateId, "");


                // averagePercentages now contains the adjusted average percentages for each sub-attribute in each matrix


                // Save changes to the database
                _context.SaveChanges();
    }

    // Return the list of selected options
    return optionsList;
}
      

        private void AddDataFromSelectedTables(int candidateId,string storedTestCode)
        {
            try
            {
                var testName = GetTestName(storedTestCode);

		   AddToResultTable("Details","ReportName", testName, candidateId, "");
                // Define a list of tables from which data needs to be fetched


                List<string> tables = new List<string> { "CandidateDetails"};

                foreach (var tableName in tables)
                {
                    PropertyInfo[] properties = null;

                    if (tableName == "CandidateDetails")
                    {
                        properties = typeof(CandidateDetails).GetProperties();

                        // Fetch all records from the CandidateDetails table for the given candidateId
                        var candidateDetailsRecords = _context.Set<CandidateDetails>()
                            .Where(c => c.candidate_id == candidateId)
                            .ToList();

                        // Iterate through each record
                        foreach (var record in candidateDetailsRecords)
                        {
                            // Iterate through each property and fetch its value
                            foreach (var property in properties)                            {
                                var value = property.GetValue(record);
                                AddToResultTable(tableName, property.Name, value?.ToString(), candidateId, testName);
                            }
                        }
                    }
               
                    
                }
               
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error adding data from selected tables: {ex.Message}");
            }
        }
        private async Task<Dictionary<string, string>> MapAnswerIdToIIAFitmentAsync(List<string> optionsList, HashSet<string> existingOptions)
        {
            var result = new Dictionary<string, string>();

            // Retrieve the AnswerId and corresponding IIAFitment for each option
            foreach (var option in optionsList)
            {
                var answer = await _context.InterestAnswersIIA.FirstOrDefaultAsync(a => a.Answer == option);
                if (answer != null && !existingOptions.Contains(answer.AnswerId))
                {
                    result.Add(answer.AnswerId, answer.IIAFitment);
                }
            }

            return result;
        }
        bool IsPercentageInRange(double? percentage, string score)
        {
            if (string.IsNullOrEmpty(score)) return false;

            score = score.Replace("%", "").Trim();

            if (score.Contains("--"))
            {
                score = score.Replace("--", "-");
            }

            if (score.StartsWith(">="))
            {
                if (double.TryParse(score.Substring(2).Trim(), out double min))
                {
                    return percentage >= min;
                }
            }
            else if (score.StartsWith("<="))
            {
                if (double.TryParse(score.Substring(2).Trim(), out double max))
                {
                    return percentage <= max;
                }
            }
            else if (score.Contains('-'))
            {
                var parts = score.Split('-');
                if (parts.Length == 2 &&
                    double.TryParse(parts[0].Trim(), out double min) &&
                    double.TryParse(parts[1].Trim(), out double max))
                {
                    return percentage > min && percentage < max;
                }
            }
            else if (double.TryParse(score.Trim(), out double exact))
            {
                return percentage == exact;
            }

            return false;
        }


 private void AddToResultTable(string tableName, string fieldName, object value, int candidateId, string testName)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(testName))
                {
                    // Retrieve the test name based on storedTestCode if possible
                    testName = GetTestName(storedtestcodee); // Implement this method to get the test name
                }

                // Ensure testName is not null or empty
                testName = testName ?? "Unknown Test";

                // Handle the value properly
                string formattedValue;

                if (value == null || string.IsNullOrWhiteSpace(value.ToString()))
                {
                    formattedValue = ""; // Set to empty string if value is null or empty
                }
                else
                {
                    string strValue = value.ToString();
                    formattedValue = char.ToUpper(strValue[0]) + strValue.Substring(1).ToLower();
                }

                var resultEntry = new Result
                {
                    CandidateId = candidateId,
                    TableName = tableName,
                    FieldName = fieldName,
                    Value = formattedValue, // Use formattedValue, which is either empty or formatted string
                    ReportName = testName,
                    timestamp_start = timestart,
                    timestamp_end = timeend
                };

                // Add the entry to the Result table
                _context.Result.Add(resultEntry);
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error adding data to result table: {ex.Message}");
            }
        }

        private string GetTestName(string storedTestCode)
        {
            // Fetch the corresponding name from the TestCode class based on storedTestCode
            var testName = _context.TestCodes
                .Where(tc => tc.Code == storedTestCode)
                .Select(tc => tc.Name)
                .FirstOrDefault();

            return testName;
        }


        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var candidate = _context.Candidates.Find(id);

            if (candidate == null)
            {
                return NotFound();
            }

            return Ok(candidate);
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] CandidateDetails candidate)
        {
            if (id != candidate.candidate_id)
            {
                return BadRequest();
            }

            _context.Entry(candidate).State = EntityState.Modified;

            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Candidates.Any(c => c.candidate_id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpGet("FetchCandidateId")]
        public IActionResult FetchCandidateId(string email, string adhar, string mobile)
        {
            try
            {
                // Query CandidateDetails table based on email, Aadhar, or Mobile
                var candidate = _context.Candidates.FirstOrDefault(c => c.email_address == email || c.Adhar_No == adhar || c.Mobile_No == mobile);

                // If candidate is found, return the candidate_id
                if (candidate != null)
                {
                    return Ok(new { candidateId = candidate.candidate_id });
                }

                // If no candidate is found, return NotFound
                return NotFound();
            }
            catch (Exception ex)
            {
                // Log the error and return an error response
                Console.WriteLine($"Error fetching candidate ID: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }





        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var candidate = _context.Candidates.Find(id);

            if (candidate == null)
            {
                return NotFound();
            }

            _context.Candidates.Remove(candidate);
            _context.SaveChanges();

            return Ok(candidate);
        }
    }
}
