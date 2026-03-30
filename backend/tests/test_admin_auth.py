"""
Backend API Tests for Dott.ssa Felaco Admin System
Tests: Admin authentication, article CRUD, public endpoints
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials from /app/memory/test_credentials.md
ADMIN_EMAIL = "dott.giuseppinafelaco@gmail.com"
ADMIN_PASSWORD = "FelacAdmin2026!"
WRONG_PASSWORD = "WrongPassword123!"
WRONG_EMAIL = "wrong@example.com"


class TestHealthEndpoint:
    """Health check endpoint tests"""
    
    def test_health_check(self):
        """Test /api/health returns healthy status"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data
        print("✓ Health check passed")


class TestAdminAuthentication:
    """Admin login endpoint tests"""
    
    def test_admin_login_success(self):
        """Test admin login with correct credentials"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "access_token" in data, "Response should contain access_token"
        assert data["token_type"] == "bearer"
        assert len(data["access_token"]) > 0
        print("✓ Admin login with correct credentials passed")
    
    def test_admin_login_wrong_password(self):
        """Test admin login with wrong password returns 401"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "email": ADMIN_EMAIL,
            "password": WRONG_PASSWORD
        })
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        data = response.json()
        assert "detail" in data
        assert "Invalid password" in data["detail"]
        print("✓ Admin login with wrong password returns 401")
    
    def test_admin_login_wrong_email(self):
        """Test admin login with wrong email returns 403 (access denied)"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "email": WRONG_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 403, f"Expected 403, got {response.status_code}"
        data = response.json()
        assert "detail" in data
        assert "Access denied" in data["detail"]
        print("✓ Admin login with wrong email returns 403 (access denied)")
    
    def test_admin_verify_with_valid_token(self):
        """Test /api/admin/verify with valid token"""
        # First login to get token
        login_response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        token = login_response.json()["access_token"]
        
        # Verify token
        response = requests.get(f"{BASE_URL}/api/admin/verify", headers={
            "Authorization": f"Bearer {token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["valid"] == True
        assert data["email"] == ADMIN_EMAIL
        print("✓ Admin verify with valid token passed")
    
    def test_admin_verify_without_token(self):
        """Test /api/admin/verify without token returns 403"""
        response = requests.get(f"{BASE_URL}/api/admin/verify")
        assert response.status_code == 403, f"Expected 403, got {response.status_code}"
        print("✓ Admin verify without token returns 403")


class TestPublicArticlesEndpoint:
    """Public articles endpoint tests"""
    
    def test_get_public_articles(self):
        """Test GET /api/articles returns published articles"""
        response = requests.get(f"{BASE_URL}/api/articles")
        assert response.status_code == 200
        data = response.json()
        assert "success" in data
        assert data["success"] == True
        assert "articles" in data
        assert "total" in data
        assert isinstance(data["articles"], list)
        print(f"✓ Public articles endpoint returned {len(data['articles'])} articles")
    
    def test_get_public_articles_with_params(self):
        """Test GET /api/articles with query params"""
        response = requests.get(f"{BASE_URL}/api/articles?published_only=true&limit=4")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert len(data["articles"]) <= 4
        print("✓ Public articles with params passed")


class TestAdminArticlesCRUD:
    """Admin article CRUD tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["access_token"]
        pytest.skip("Authentication failed - skipping authenticated tests")
    
    def test_get_admin_articles_requires_auth(self):
        """Test GET /api/admin/articles requires authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/articles")
        assert response.status_code == 403, f"Expected 403, got {response.status_code}"
        print("✓ Admin articles endpoint requires auth")
    
    def test_get_admin_articles_with_auth(self, auth_token):
        """Test GET /api/admin/articles with valid token"""
        response = requests.get(f"{BASE_URL}/api/admin/articles", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "articles" in data
        assert "total" in data
        print(f"✓ Admin articles returned {data['total']} total articles")
    
    def test_create_article(self, auth_token):
        """Test POST /api/admin/articles creates article"""
        unique_id = str(uuid.uuid4())[:8]
        article_data = {
            "title": f"TEST_Article_{unique_id}",
            "excerpt": "Test excerpt for automated testing",
            "content": "Full content for the test article",
            "category": "Testing",
            "tags": ["test", "automated"],
            "published": False
        }
        
        response = requests.post(f"{BASE_URL}/api/admin/articles", 
            json=article_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        # Verify response structure
        assert "id" in data
        assert data["title"] == article_data["title"]
        assert data["excerpt"] == article_data["excerpt"]
        assert data["content"] == article_data["content"]
        assert data["category"] == article_data["category"]
        assert data["published"] == False
        assert "slug" in data
        assert "created_at" in data
        
        # Verify persistence with GET
        article_id = data["id"]
        get_response = requests.get(f"{BASE_URL}/api/admin/articles/{article_id}", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert get_response.status_code == 200
        fetched = get_response.json()["article"]
        assert fetched["title"] == article_data["title"]
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/admin/articles/{article_id}", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        print("✓ Create article and verify persistence passed")
    
    def test_update_article(self, auth_token):
        """Test PUT /api/admin/articles/{id} updates article"""
        # Create article first
        unique_id = str(uuid.uuid4())[:8]
        create_response = requests.post(f"{BASE_URL}/api/admin/articles", 
            json={
                "title": f"TEST_Update_{unique_id}",
                "excerpt": "Original excerpt",
                "content": "Original content",
                "category": "Testing",
                "tags": ["test"],
                "published": False
            },
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        article_id = create_response.json()["id"]
        
        # Update article
        update_data = {
            "title": f"TEST_Updated_{unique_id}",
            "excerpt": "Updated excerpt",
            "published": True
        }
        update_response = requests.put(f"{BASE_URL}/api/admin/articles/{article_id}",
            json=update_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert update_response.status_code == 200
        updated = update_response.json()["article"]
        assert updated["title"] == update_data["title"]
        assert updated["excerpt"] == update_data["excerpt"]
        assert updated["published"] == True
        
        # Verify persistence
        get_response = requests.get(f"{BASE_URL}/api/admin/articles/{article_id}", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        fetched = get_response.json()["article"]
        assert fetched["title"] == update_data["title"]
        assert fetched["published"] == True
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/admin/articles/{article_id}", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        print("✓ Update article and verify persistence passed")
    
    def test_delete_article(self, auth_token):
        """Test DELETE /api/admin/articles/{id} deletes article"""
        # Create article first
        unique_id = str(uuid.uuid4())[:8]
        create_response = requests.post(f"{BASE_URL}/api/admin/articles", 
            json={
                "title": f"TEST_Delete_{unique_id}",
                "excerpt": "To be deleted",
                "content": "Content to delete",
                "category": "Testing",
                "tags": ["test"],
                "published": False
            },
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        article_id = create_response.json()["id"]
        
        # Delete article
        delete_response = requests.delete(f"{BASE_URL}/api/admin/articles/{article_id}", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert delete_response.status_code == 200
        assert delete_response.json()["success"] == True
        
        # Verify deletion
        get_response = requests.get(f"{BASE_URL}/api/admin/articles/{article_id}", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert get_response.status_code == 404
        print("✓ Delete article and verify removal passed")
    
    def test_toggle_publish_article(self, auth_token):
        """Test toggling publish status on article"""
        # Create unpublished article
        unique_id = str(uuid.uuid4())[:8]
        create_response = requests.post(f"{BASE_URL}/api/admin/articles", 
            json={
                "title": f"TEST_Toggle_{unique_id}",
                "excerpt": "Toggle test",
                "content": "Content",
                "category": "Testing",
                "tags": ["test"],
                "published": False
            },
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        article_id = create_response.json()["id"]
        
        # Toggle to published
        toggle_response = requests.put(f"{BASE_URL}/api/admin/articles/{article_id}",
            json={"published": True},
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert toggle_response.status_code == 200
        assert toggle_response.json()["article"]["published"] == True
        
        # Toggle back to unpublished
        toggle_response2 = requests.put(f"{BASE_URL}/api/admin/articles/{article_id}",
            json={"published": False},
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert toggle_response2.status_code == 200
        assert toggle_response2.json()["article"]["published"] == False
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/admin/articles/{article_id}", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        print("✓ Toggle publish status passed")
    
    def test_create_article_requires_auth(self):
        """Test POST /api/admin/articles requires authentication"""
        response = requests.post(f"{BASE_URL}/api/admin/articles", json={
            "title": "Unauthorized",
            "excerpt": "Test",
            "content": "Test",
            "category": "Test",
            "tags": []
        })
        assert response.status_code == 403
        print("✓ Create article requires auth")
    
    def test_update_article_requires_auth(self):
        """Test PUT /api/admin/articles/{id} requires authentication"""
        response = requests.put(f"{BASE_URL}/api/admin/articles/fake-id", json={
            "title": "Unauthorized"
        })
        assert response.status_code == 403
        print("✓ Update article requires auth")
    
    def test_delete_article_requires_auth(self):
        """Test DELETE /api/admin/articles/{id} requires authentication"""
        response = requests.delete(f"{BASE_URL}/api/admin/articles/fake-id")
        assert response.status_code == 403
        print("✓ Delete article requires auth")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
