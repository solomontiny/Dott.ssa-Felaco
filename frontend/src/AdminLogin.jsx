import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase";

const allowedEmail = "scotttinys@gmail.com";

const AdminLogin = ({ onLoginSuccess }) => {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user.email !== allowedEmail) {
        alert("Not authorized");
        return;
      }

      alert("Login successful");
      onLoginSuccess();
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
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          textAlign: "center",
          width: "320px",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Admin Login</h2>

        <button
          onClick={handleLogin}
          type="button"
          style={{
            width: "100%",
            padding: "12px 16px",
            backgroundColor: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;