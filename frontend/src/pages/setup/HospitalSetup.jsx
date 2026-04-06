import { useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import Card from "../../ui/Card";
import Input from "../../ui/Input";
import Button from "../../ui/Button";

function HospitalSetup() {
  const [form, setForm] = useState({
    latitude: "",
    longitude: "",
    owns_bank: false,

    bank_name: "",
    bank_email: "",
    bank_phone: "",
    bank_password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      await API.post("/setup/hospital", form);
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
        <h2 style={{ marginBottom: 12 }}>Hospital Setup</h2>
        {error ? <p style={{ color: "var(--color-error)", marginBottom: 12 }}>{error}</p> : null}

        <form onSubmit={handleSubmit} className="form">
          <Input label="Latitude" type="text" name="latitude" value={form.latitude} onChange={handleChange} required />
          <Input label="Longitude" type="text" name="longitude" value={form.longitude} onChange={handleChange} required />

          <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="checkbox"
              name="owns_bank"
              checked={form.owns_bank}
              onChange={handleChange}
            />
            <span style={{ fontWeight: 700 }}>Owns a Blood Bank?</span>
          </label>

          {form.owns_bank && (
            <Card title="Blood Bank Details" className="">
              <div className="form">
                <Input label="Blood Bank Name" type="text" name="bank_name" value={form.bank_name} onChange={handleChange} required />
                <Input label="Blood Bank Email" type="email" name="bank_email" value={form.bank_email} onChange={handleChange} required />
                <Input label="Blood Bank Phone" type="text" name="bank_phone" value={form.bank_phone} onChange={handleChange} required />
                <Input label="Blood Bank Password" type="password" name="bank_password" value={form.bank_password} onChange={handleChange} required />
              </div>
            </Card>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default HospitalSetup;