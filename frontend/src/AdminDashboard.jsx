import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { db, storage } from "./firebase";

const AdminDashboard = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchArticles = async () => {
    try {
      const q = query(collection(db, "articles"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const articleList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setArticles(articleList);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please fill in title and content");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = "";
      let imageName = "";

      if (image) {
        const fileName = `${Date.now()}-${image.name}`;
        const storageRef = ref(storage, `articles/${fileName}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
        imageName = image.name;
      }

      await addDoc(collection(db, "articles"), {
        title,
        content,
        imageUrl,
        imageName,
        createdAt: Date.now(),
        date: new Date().toLocaleDateString(),
      });

      setTitle("");
      setContent("");
      setImage(null);

      await fetchArticles();
      alert("Article published successfully");
    } catch (error) {
      console.error("Error publishing article:", error);
      alert("Failed to publish article");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate("/admin/login");
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "24px",
            alignItems: "start",
          }}
        >
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
              disabled={loading}
              style={{
                backgroundColor: "#0f172a",
                color: "#ffffff",
                border: "none",
                padding: "14px 22px",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: "bold",
                cursor: "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Publishing..." : "Publish Article"}
            </button>
          </div>

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

                    {article.imageUrl && (
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        style={{
                          width: "100%",
                          maxHeight: "180px",
                          objectFit: "cover",
                          borderRadius: "10px",
                          marginBottom: "10px",
                        }}
                      />
                    )}

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