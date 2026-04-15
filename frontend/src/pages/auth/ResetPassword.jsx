import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Card from "../../ui/Card";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import { useToast } from "../../context/ToastContext";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    token: "",
    new_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state?.token) {
      setForm((p) => ({ ...p, token: location.state.token }));
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.token || !form.new_password) {
      setError("All fields are required");
      return;
    }
    if (String(form.new_password).length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await API.post("/auth/reset-password", form);
      showToast("success", "Password reset successfully");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
      showToast("error", "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <h2 style={{ marginBottom: 12 }}>Reset Password</h2>
        {error ? <p style={{ color: "var(--color-error)", marginBottom: 12 }}>{error}</p> : null}

        <form onSubmit={handleSubmit} className="form">
          <Input
            label="Reset Token"
            value={form.token}
            onChange={(e) => setForm({ ...form, token: e.target.value })}
            placeholder="paste uuid token"
          />
          <Input
            label="New Password"
            type="password"
            value={form.new_password}
            onChange={(e) => setForm({ ...form, new_password: e.target.value })}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>

        <p className="muted" style={{ marginTop: 12 }}>
          <Link to="/login" style={{ color: "var(--color-primary)", fontWeight: 700 }}>Back to login</Link>
        </p>
      </Card>
    </div>
  );
}

export default ResetPassword;

