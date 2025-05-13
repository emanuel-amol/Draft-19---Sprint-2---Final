# security_protocols/monitoring/logger.py
from datetime import datetime

# In-memory storage for logs (for simplicity, but could be upgraded to a database)
auth_logs = []
honeypot_logs = []

def log_activity(user_id, action, email=None):
    """
    Log an activity by a user
    
    Args:
        user_id: ID of the user (can be None for unauthenticated actions)
        action: Description of the action
        email: Email address (useful for login attempts)
    
    Returns:
        The created log entry
    """
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_entry = {
        "timestamp": timestamp,
        "user_id": user_id,
        "action": action,
        "email": email  # Email is important for identifying failed login attempts
    }
    # Add to the in-memory logs
    auth_logs.append(log_entry)
    
    # If you wanted to persist logs to a file, you could add that functionality here
    # with open("security_protocols/monitoring/activity_logs.log", "a") as f:
    #     f.write(f"{timestamp} | User: {user_id} | {action} | {email or ''}\n")
    
    return log_entry

def get_logs(limit=100):
    """
    Get the most recent authentication logs
    
    Args:
        limit: Maximum number of logs to return
    
    Returns:
        List of log entries, newest first
    """
    # Return logs in reverse order (newest first)
    return auth_logs[::-1][:limit]

def log_honeypot(ip, action, details=None):
    """
    Log a honeypot trigger
    
    Args:
        ip: IP address that triggered the honeypot
        action: The action or endpoint that was accessed
        details: Additional details (e.g., submitted credentials)
    """
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_entry = {
        "timestamp": timestamp,
        "ip": ip,
        "action": action,
        "details": details
    }
    honeypot_logs.append(log_entry)
    
    # Optionally write to a separate log file
    # with open("security_protocols/monitoring/honeypot_logs.log", "a") as f:
    #     f.write(f"{timestamp} | IP: {ip} | {action} | {details or ''}\n")
    
    return log_entry

def get_honeypot_logs(limit=100):
    """
    Get the most recent honeypot logs
    
    Args:
        limit: Maximum number of logs to return
    
    Returns:
        List of honeypot log entries, newest first
    """
    return honeypot_logs[::-1][:limit]

# Helper function to clear all logs (for testing purposes)
def clear_logs():
    """Clear all logs from memory (use with caution)"""
    global auth_logs, honeypot_logs
    auth_logs.clear()
    honeypot_logs.clear()