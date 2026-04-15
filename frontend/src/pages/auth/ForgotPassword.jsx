import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Card from "../../ui/Card";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import { useToast } from "../../context/ToastContext";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Enter a valid email");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await API.post("/auth/forgot-password", { email });
      setToken(res.data.reset_token);
      showToast("success", "Reset token generated");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate token");
      showToast("error", "Failed to generate token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <h2 style={{ marginBottom: 12 }}>Forgot Password</h2>
        <p className="muted" style={{ marginBottom: 12 }}>
          Enter your email to generate a reset token (no email system).
        </p>
        {error ? <p style={{ color: "var(--color-error)", marginBottom: 12 }}>{error}</p> : null}

        <form onSubmit={handleSubmit} className="form">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button type="submit" disabled={loading}>
            {loading ? "Generating..." : "Generate Token"}
          </Button>
        </form>

        {token ? (
          <div style={{ marginTop: 16 }}>
            <Card title="Reset Token">
              <p style={{ fontFamily: "monospace", wordBreak: "break-all" }}>{token}</p>
              <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
                <Button
                  onClick={() => {
                    navigate("/reset-password", { state: { token } });
                  }}
                >
                  Go to Reset Password
                </Button>
                <Link to="/login" className="muted" style={{ alignSelf: "center" }}>
                  Back to login
                </Link>
              </div>
            </Card>
          </div>
        ) : (
          <p className="muted" style={{ marginTop: 12 }}>
            Remembered? <Link to="/login" style={{ color: "var(--color-primary)", fontWeight: 700 }}>Login</Link>
          </p>
        )}
      </Card>
    </div>
  );
}

export default ForgotPassword;

