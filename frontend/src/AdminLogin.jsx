import React from "react";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "./firebase";

const allowedEmail = "scotttinys@gmail.com";

const AdminLogin = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user.email !== allowedEmail) {
        alert("Not authorized");
        return;
      }

      alert("Login successful");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Firebase login error:", error);
      alert(`Login failed: ${error.code} - ${error.message}`);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f3f4f6",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          textAlign: "center",
          width: "320px",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Admin Login</h2>

        <button
          onClick={handleLogin}
          style={{
            backgroundColor: "#2563eb",
            color: "#fff",
            border: "none",
            padding: "14px 20px",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;