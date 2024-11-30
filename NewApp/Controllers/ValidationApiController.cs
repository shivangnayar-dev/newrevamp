using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewApp.Models;

namespace NewApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValidationController : ControllerBase
    {
        private readonly CandidateDbContext _context;

        public ValidationController(CandidateDbContext context)
        {
            _context = context;
        }

        [HttpPost("updateLoginStatus")]
        public async Task<IActionResult> UpdateLoginStatus([FromBody] PasswordSubmissionRequest request)
        {
            if (request == null || request.CandidateId <= 0)
            {
                return BadRequest("Invalid input. CandidateId and Password are required.");
            }

            try
            {
                // Check if the candidate exists in the Validationtable
                var validationEntry = await _context.Validationtable
                    .FirstOrDefaultAsync(v => v.candidateid == request.CandidateId);

                if (validationEntry != null)
                {
                    // Check if login_page is already 1
                    if (validationEntry.login_page)
                    {
                        return Ok(new { Message = "Login page already validated.", Action = "askTestCode" });
                    }

                    // Update login_page to 1 and set timestamp
                    validationEntry.login_page = true;
                    validationEntry.timestamp = DateTime.UtcNow;

                    _context.Validationtable.Update(validationEntry);
                }
                else
                {
                    // If no entry exists for this candidate, create a new one
                    var newValidationEntry = new Validationtable
                    {
                        candidateid = request.CandidateId,
                        login_page = true,
                        register_page = false,
                        info_page = false,
                        candidateinfo_page = false,
                        teststatus = "Not Started",
                        timestamp = DateTime.UtcNow


                    };

                    await _context.Validationtable.AddAsync(newValidationEntry);
                }

                await _context.SaveChangesAsync();

                return Ok(new { Message = "Login status updated successfully.", Action = "askTestCode" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
           }
        [HttpPost("updateScreenValidation")]
        public async Task<IActionResult> UpdateScreenValidation([FromBody] ValidationUpdateRequest updateRequest)
        {
            if (updateRequest == null || updateRequest.CandidateId <= 0)
            {
                return BadRequest("Invalid request. CandidateId is required.");
            }

            try
            {
                // Fetch the candidate's validation entry
                var validationEntry = await _context.Validationtable.FirstOrDefaultAsync(v => v.candidateid == updateRequest.CandidateId);

                if (validationEntry == null)
                {
                    // If no entry exists, create a new one
                    validationEntry = new Validationtable
                    {
                        candidateid = updateRequest.CandidateId,
                        info_page = updateRequest.InfoPage,
                        candidateinfo_page = updateRequest.CandidateInfoPage,
                        timestamp = DateTime.UtcNow

                    };

                    _context.Validationtable.Add(validationEntry);
                }
                else
                {
                    // Update existing entry
                    validationEntry.info_page = updateRequest.InfoPage;
                    validationEntry.candidateinfo_page = updateRequest.CandidateInfoPage;
                    validationEntry.timestamp = DateTime.UtcNow;
                }

                // Save changes to the database
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Message = "Validation updated successfully",
                    Validation = validationEntry
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Message = "An error occurred while updating validation",
                    Error = ex.Message
                });
            }
        }
        [HttpPost("updateTestStatus")]
        public async Task<IActionResult> UpdateTestStatus([FromBody] UpdateTestStatusRequest request)
        {
            if (request.CandidateId <= 0)
            {
                return BadRequest("Invalid Candidate ID.");
            }

            try
            {
                // Find the validation record for the candidate
                var validationRecord = await _context.Validationtable.FirstOrDefaultAsync(v => v.candidateid == request.CandidateId);

                if (validationRecord == null)
                {
                    // If no record exists, create a new one
                    validationRecord = new Validationtable
                    {
                        candidateid = request.CandidateId,
                        teststatus = $"CurrentSectionIndex:{request.CurrentSectionIndex}",
                        timestamp = DateTime.UtcNow
                    };

                    await _context.Validationtable.AddAsync(validationRecord);
                }
                else
                {
                    // Update the teststatus field with the current section index
                    validationRecord.teststatus = $"CurrentSectionIndex:{request.CurrentSectionIndex}";
                    validationRecord.timestamp = DateTime.UtcNow;

                    _context.Validationtable.Update(validationRecord);
                }

                // Save changes to the database
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Message = "Test status updated successfully.",
                    CandidateId = validationRecord.candidateid,
                    TestStatus = validationRecord.teststatus,
                    Timestamp = validationRecord.timestamp
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Message = "An error occurred while updating test status.",
                    Error = ex.Message
                });
            }
        }
        [HttpGet("getTestStatus")]
        public async Task<IActionResult> GetTestStatus([FromQuery] int candidateId)
        {
            if (candidateId <= 0)
            {
                return BadRequest("Invalid Candidate ID.");
            }

            try
            {
                var validationRecord = await _context.Validationtable.FirstOrDefaultAsync(v => v.candidateid == candidateId);

                if (validationRecord == null)
                {
                    return NotFound("Validation record not found for the provided Candidate ID.");
                }

                // Parse the current section index from the teststatus field
                int currentSectionIndex = 0;
                if (!string.IsNullOrEmpty(validationRecord.teststatus) && validationRecord.teststatus.StartsWith("CurrentSectionIndex:"))
                {
                    currentSectionIndex = int.Parse(validationRecord.teststatus.Split(':')[1]);
                }

                return Ok(new
                {
                    CandidateId = validationRecord.candidateid,
                    CurrentSectionIndex = currentSectionIndex,
                    TestStatus = validationRecord.teststatus,
                    Timestamp = validationRecord.timestamp
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Message = "An error occurred while fetching the test status.",
                    Error = ex.Message
                });
            }
        }
        [HttpPost("updateTestSection")]
        public async Task<IActionResult> UpdateTestSection([FromBody] UpdateSectionRequest request)
        {
            if (request.CandidateId <= 0 || string.IsNullOrEmpty(request.SectionIndex))
            {
                return BadRequest("Invalid candidate ID or section index.");
            }

            // Find the validation record for the candidate
            var validationRecord = await _context.Validationtable.FirstOrDefaultAsync(v => v.candidateid == request.CandidateId);

            if (validationRecord == null)
            {
                return NotFound("Validation record not found for the provided candidate ID.");
            }

            // Dynamically generate the property name for the test section
            var propertyName = $"test_section_{request.SectionIndex}";
            var property = typeof(Validationtable).GetProperty(propertyName);

            if (property == null)
            {
                return BadRequest($"Invalid section index: {request.SectionIndex}.");
            }

            // Set the property to "1" (mark the section as completed)
            property.SetValue(validationRecord, "1");

            // Update timestamp
            validationRecord.timestamp = DateTime.UtcNow;

            // Save changes
            _context.Validationtable.Update(validationRecord);
            await _context.SaveChangesAsync();

            return Ok(new { Message = $"Test section {request.SectionIndex} updated successfully." });
        }
        [HttpGet("getValidationStatus")]
        public async Task<IActionResult> GetValidationStatus([FromQuery] int candidateId)
        {
            if (candidateId <= 0)
            {
                return BadRequest("Invalid candidate ID.");
            }

            // Fetch validation status for the given candidate ID
            var validationRecord = await _context.Validationtable.FirstOrDefaultAsync(v => v.candidateid == candidateId);

            if (validationRecord == null)
            {
                return NotFound("Validation status not found for the provided candidate ID.");
            }

            // Return the validation status
            return Ok(new
            {
                candidateId = validationRecord.candidateid,
                info_page = validationRecord.info_page,
                candidateinfo_page = validationRecord.candidateinfo_page,
                test_status = validationRecord.teststatus,
                timestamp = validationRecord.timestamp
            });
        }

        public class ValidationRequest
        {
            public int CandidateId { get; set; }
            public string Field { get; set; } // Field to update (e.g., "info_page", "candidateinfo_page")
            public bool Value { get; set; } // Value to set (true/false)
        }

        public class PasswordSubmissionRequest
        {
            public int CandidateId { get; set; }

        }
        public class UpdateTestStatusRequest
        {
            public int CandidateId { get; set; }
            public int CurrentSectionIndex { get; set; } // The index of the current test section
        }
        public class SectionStatusUpdateRequest
        {
            public int CandidateId { get; set; }
            public string SectionField { get; set; } // e.g., "test_section_1"
            public bool Value { get; set; } // true to mark the section as completed
        }
        public class ValidationUpdateRequest
        {
            public int CandidateId { get; set; }
            public bool InfoPage { get; set; }
            public bool CandidateInfoPage { get; set; }
        }
        public class UpdateSectionRequest
        {

            public int CandidateId { get; set; }


            public string SectionIndex { get; set; }
        }



    }
}

