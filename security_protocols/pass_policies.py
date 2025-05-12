# security_protocols/passwords/password_policy.py

import re
from security_protocols.passwords.hibp_checker import check_pwned_password

def validate_password(password):
    """
    Validates a password against the system's password policy.
    
    Returns:
        tuple: (is_valid, list of violations)
    """
    violations = []

    # Length check
    if len(password) < 8:
        violations.append("Password must be at least 8 characters long")
    
    # Complexity checks
    if not re.search(r'[A-Z]', password):
        violations.append("Password must contain at least one uppercase letter")
    
    if not re.search(r'[a-z]', password):
        violations.append("Password must contain at least one lowercase letter")
    
    if not re.search(r'[0-9]', password):
        violations.append("Password must contain at least one digit")
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        violations.append("Password must contain at least one special character")
    
    # Only check against HIBP if no policy violations
    if not violations and check_pwned_password(password):
        violations.append("Password has been found in a known data breach")
    
    return (len(violations) == 0, violations)

def enforce_password_policy(password):
    """
    Enforces the password policy, raising an exception if the password doesn't comply.
    
    Args:
        password: The password to validate
        
    Raises:
        ValueError: If the password doesn't meet the policy requirements
    """
    is_valid, violations = validate_password(password)
    
    if not is_valid:
        error_message = "Password policy violations:\n- " + "\n- ".join(violations)
        raise ValueError(error_message)
    
    return True