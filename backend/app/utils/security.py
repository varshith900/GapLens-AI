import ipaddress
import socket
from urllib.parse import urlparse

def is_safe_public_url(url: str) -> tuple[bool, str]:
    """
    Validates that a URL is a legitimate public HTTP/HTTPS URL
    and prevents Server-Side Request Forgery (SSRF) against private/internal networks.
    """
    if not url or not isinstance(url, str):
        return False, "URL must be a non-empty string"
    
    url = url.strip()
    try:
        parsed = urlparse(url)
    except Exception as e:
        return False, f"Invalid URL syntax: {str(e)}"
    
    if parsed.scheme.lower() not in ("http", "https"):
        return False, f"Unsupported protocol '{parsed.scheme}'. Only http and https are allowed."
    
    hostname = parsed.hostname
    if not hostname:
        return False, "URL does not contain a valid hostname"
    
    hostname_lower = hostname.lower()
    
    # Block loopback, localhost, and internal identifiers
    blocked_hosts = {
        "localhost", "127.0.0.1", "0.0.0.0", "::1", "metadata.google.internal",
        "instance-data", "169.254.169.254"
    }
    if hostname_lower in blocked_hosts or hostname_lower.endswith(".local") or hostname_lower.endswith(".internal"):
        return False, f"Access to private/internal network destination '{hostname}' is prohibited."
    
    # Resolve host to IP and ensure not in private/reserved ranges
    try:
        ip_str = socket.gethostbyname(hostname)
        ip = ipaddress.ip_address(ip_str)
        if ip.is_private or ip.is_loopback or ip.is_reserved or ip.is_link_local:
            return False, f"Resolved IP {ip_str} is in a private/restricted address range."
    except socket.gaierror:
        # If DNS cannot resolve, we allow it to attempt safe network fetch which will yield proper DNS error
        pass
    except Exception as e:
        return False, f"Hostname resolution error: {str(e)}"
    
    return True, "URL is safe"
