import re
from datetime import datetime


def create_slug(title: str) -> str:
    """Create a URL-friendly slug from title"""
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s-]+', '-', slug)
    slug = slug.strip('-')
    # Add timestamp to ensure uniqueness
    timestamp = datetime.utcnow().strftime('%Y%m%d')
    return f"{slug}-{timestamp}"
