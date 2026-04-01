import React, { useState } from "react";

const AdminDashboard = ({ onLogout }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [articles, setArticles] = useState([]);

  const handlePublish = () => {
    if (!title.trim() || !content.trim()) {
      alert("Please fill in title and content");
      return;
    }

    const newArticle = {
      id: Date.now(),
      title,
      content,
      imageName: image ? image.name : "",
      date: new Date().toLocaleDateString(),
    };

    setArticles([newArticle, ...articles]);
    setTitle("");
    setContent("");
    setImage(null);
  };

const handleLogout = () => {
  onLogout();
};
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3f6fb",
        padding: "32px 18px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1150px",
          margin: "0 auto",
        }}
      >
        {/* Top Header */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "18px",
            padding: "24px 28px",
            boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
            marginBottom: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                margin: "0 0 8px 0",
                fontSize: "32px",
                color: "#0f172a",
              }}
            >
              Admin Dashboard
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: "15px",
                color: "#64748b",
              }}
            >
              Welcome, Admin. Manage your articles easily from here.
            </p>
          </div>

          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#e11d48",
              color: "#ffffff",
              border: "none",
              padding: "12px 18px",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>

        {/* Main Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "24px",
            alignItems: "start",
          }}
        >
          {/* Left Section */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "18px",
              padding: "24px",
              boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: "22px",
                fontSize: "22px",
                color: "#0f172a",
              }}
            >
              Create New Article
            </h2>

            <div style={{ marginBottom: "18px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "bold",
                  color: "#1e293b",
                }}
              >
                Title
              </label>
              <input
                type="text"
                placeholder="Enter article title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  fontSize: "15px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "bold",
                  color: "#1e293b",
                }}
              >
                Content
              </label>
              <textarea
                placeholder="Write article content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="7"
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  fontSize: "15px",
                  resize: "vertical",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "bold",
                  color: "#1e293b",
                }}
              >
                Upload Image
              </label>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                style={{ fontSize: "14px" }}
              />
              {image && (
                <p
                  style={{
                    marginTop: "8px",
                    marginBottom: 0,
                    color: "#64748b",
                    fontSize: "14px",
                  }}
                >
                  Selected: {image.name}
                </p>
              )}
            </div>

            <button
              onClick={handlePublish}
              style={{
                backgroundColor: "#0f172a",
                color: "#ffffff",
                border: "none",
                padding: "14px 22px",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Publish Article
            </button>
          </div>

          {/* Right Section */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "18px",
                padding: "24px",
                boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  marginBottom: "14px",
                  fontSize: "22px",
                  color: "#0f172a",
                }}
              >
                Overview
              </h2>
              <p style={{ margin: "0 0 10px 0", color: "#475569" }}>
                Total Articles: <strong>{articles.length}</strong>
              </p>
              <p style={{ margin: 0, color: "#475569" }}>
                Status: <strong>Admin Active</strong>
              </p>
            </div>

            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "18px",
                padding: "24px",
                boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  marginBottom: "16px",
                  fontSize: "22px",
                  color: "#0f172a",
                }}
              >
                Existing Articles
              </h2>

              {articles.length === 0 ? (
                <div
                  style={{
                    padding: "16px",
                    borderRadius: "10px",
                    backgroundColor: "#f8fafc",
                    color: "#64748b",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  No articles yet.
                </div>
              ) : (
                articles.map((article) => (
                  <div
                    key={article.id}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      padding: "14px",
                      marginBottom: "14px",
                      backgroundColor: "#f8fafc",
                    }}
                  >
                    <h3
                      style={{
                        margin: "0 0 8px 0",
                        fontSize: "17px",
                        color: "#0f172a",
                      }}
                    >
                      {article.title}
                    </h3>
                    <p
                      style={{
                        margin: "0 0 10px 0",
                        color: "#475569",
                        fontSize: "14px",
                        lineHeight: "1.5",
                      }}
                    >
                      {article.content.length > 120
                        ? article.content.substring(0, 120) + "..."
                        : article.content}
                    </p>
                    <p
                      style={{
                        margin: "0 0 4px 0",
                        fontSize: "12px",
                        color: "#64748b",
                      }}
                    >
                      Date: {article.date}
                    </p>
                    {article.imageName && (
                      <p
                        style={{
                          margin: 0,
                          fontSize: "12px",
                          color: "#64748b",
                        }}
                      >
                        Image: {article.imageName}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;