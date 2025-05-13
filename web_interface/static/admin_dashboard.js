/**
 * Admin Dashboard JavaScript
 * Handles interactive elements and log display functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate on Scroll) library
    if (typeof AOS !== 'undefined') {
        AOS.init({ 
            once: true,
            duration: 800,
            offset: 100
        });
    }

    // === Collapsible Sections ===
    // Find all collapsible headers and add click event listeners
    const collapsibles = document.querySelectorAll('.collapsible');
    
    collapsibles.forEach(function(collapsible) {
        collapsible.addEventListener('click', function() {
            // Find the content section (next sibling)
            const content = this.nextElementSibling;
            
            // Toggle the display
            const isHidden = content.style.display === 'none' || content.style.display === '';
            content.style.display = isHidden ? 'block' : 'none';
            
            // Update the toggle icon
            const toggleIcon = this.querySelector('.toggle-icon');
            if (toggleIcon) {
                toggleIcon.textContent = isHidden ? '▲' : '▼';
            }
        });
    });

    // === Copy Invite Link ===
    // Handle clicking the copy button for invite links
    const copyButtons = document.querySelectorAll('.copy-invite-btn');
    
    copyButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // Find the target element based on the data-target attribute
            const targetSelector = this.getAttribute('data-target');
            const targetElement = document.querySelector(targetSelector);
            
            if (targetElement) {
                // Select the text
                targetElement.select();
                
                try {
                    // Copy to clipboard
                    document.execCommand('copy');
                    
                    // Show feedback
                    const originalText = this.textContent;
                    this.textContent = 'Copied!';
                    
                    // Reset the button text after a delay
                    setTimeout(() => {
                        this.textContent = originalText;
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy text: ', err);
                }
            }
        });
    });

    // === Table Row Highlighting ===
    // Add hover effects for table rows
    const tableRows = document.querySelectorAll('tbody tr');
    
    tableRows.forEach(function(row) {
        // Store the original background color
        const originalBackground = window.getComputedStyle(row).backgroundColor;
        
        row.addEventListener('mouseenter', function() {
            // Darken the background slightly on hover
            if (row.classList.contains('error-row')) {
                row.style.backgroundColor = 'rgba(231, 76, 60, 0.15)';
            } else if (row.classList.contains('success-row')) {
                row.style.backgroundColor = 'rgba(40, 167, 69, 0.15)';
            } else if (row.classList.contains('honeypot-row')) {
                row.style.backgroundColor = 'rgba(243, 156, 18, 0.15)';
            } else {
                row.style.backgroundColor = 'rgba(0, 78, 124, 0.05)';
            }
        });
        
        row.addEventListener('mouseleave', function() {
            // Restore the original background
            row.style.backgroundColor = originalBackground;
        });
    });

    // === Time Format ===
    // Format timestamps to be more readable
    const timestamps = document.querySelectorAll('td:first-child');
    
    timestamps.forEach(function(cell) {
        const timestamp = cell.textContent.trim();
        
        // Check if it's a valid timestamp format (YYYY-MM-DD HH:MM:SS)
        if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(timestamp)) {
            try {
                const date = new Date(timestamp.replace(' ', 'T'));
                
                // Format the date and time in a more readable format
                const formattedDate = new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }).format(date);
                
                cell.textContent = formattedDate;
                
                // Add title with the original timestamp for reference
                cell.title = timestamp;
            } catch (e) {
                // If there's an error parsing the date, keep the original format
                console.error('Error formatting date:', e);
            }
        }
    });

    // === Log Filter ===
    // Allow filtering logs by type or content
    const filterInput = document.getElementById('log-filter');
    
    if (filterInput) {
        filterInput.addEventListener('input', function() {
            const filterValue = this.value.toLowerCase();
            const tableRows = document.querySelectorAll('tbody tr');
            
            tableRows.forEach(function(row) {
                const text = row.textContent.toLowerCase();
                
                if (text.includes(filterValue)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
});

// === Standalone Functions ===

// Function to toggle login logs section
function toggleLogins() {
    toggleSection("loginsSection");
}

// Function to toggle JWT logs section
function toggleJwtLogs() {
    toggleSection("jwtSection");
}

// Function to toggle honeypot logs section
function toggleHoneypot() {
    toggleSection("honeypotSection");
}

// Generic function to toggle a section
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const isHidden = section.style.display === "none" || section.style.display === "";
    section.style.display = isHidden ? "block" : "none";
    
    // Update the toggle icon
    const header = section.previousElementSibling;
    const toggleIcon = header.querySelector('.toggle-icon');
    if (toggleIcon) {
        toggleIcon.textContent = isHidden ? "▲" : "▼";
    }
}

// Function to export logs as CSV
function exportLogs(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    const table = section.querySelector('table');
    if (!table) return;
    
    const rows = table.querySelectorAll('tr');
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Extract headers
    const headers = [];
    const headerRow = table.querySelector('thead tr');
    headerRow.querySelectorAll('th').forEach(function(cell) {
        headers.push('"' + cell.textContent.trim() + '"');
    });
    csvContent += headers.join(',') + '\n';
    
    // Extract data rows
    table.querySelectorAll('tbody tr').forEach(function(row) {
        const rowData = [];
        row.querySelectorAll('td').forEach(function(cell) {
            rowData.push('"' + cell.textContent.trim().replace(/"/g, '""') + '"');
        });
        csvContent += rowData.join(',') + '\n';
    });
    
    // Create a download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', sectionId + '_' + new Date().toISOString().split('T')[0] + '.csv');
    document.body.appendChild(link);
    
    // Trigger the download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
}