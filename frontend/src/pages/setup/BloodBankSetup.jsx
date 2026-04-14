import { useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import Card from "../../ui/Card";
import Input from "../../ui/Input";
import Button from "../../ui/Button";

function BloodBankSetup() {
  const [form, setForm] = useState({
    latitude: "",
    longitude: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      await API.post("/setup/bloodbank", form);
      showToast("success", "Setup complete");
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      setError("Failed to setup");
      showToast("error", "Failed to setup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <h2 style={{ marginBottom: 12 }}>Blood Bank Setup</h2>
        {error ? <p style={{ color: "var(--color-error)", marginBottom: 12 }}>{error}</p> : null}

        <form onSubmit={handleSubmit} className="form">
          <Input label="Latitude" type="text" name="latitude" value={form.latitude} onChange={handleChange} required />
          <Input label="Longitude" type="text" name="longitude" value={form.longitude} onChange={handleChange} required />
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default BloodBankSetup;