import { useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import Card from "../../ui/Card";
import Input from "../../ui/Input";
import Button from "../../ui/Button";

function DonorSetup() {
  const [form, setForm] = useState({
    blood_grp: "",
    dob: ""
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
      await API.post("/setup/donor", form);
      showToast("success", "Profile completed");
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      setError("Failed to save profile");
      showToast("error", "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <h2 style={{ marginBottom: 12 }}>Complete Donor Profile</h2>
        {error ? <p style={{ color: "var(--color-error)", marginBottom: 12 }}>{error}</p> : null}

        <form onSubmit={handleSubmit} className="form">
          <div className="field">
            <div className="label">Blood Group</div>
            <select className="input" name="blood_grp" value={form.blood_grp} onChange={handleChange} required>
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          <Input label="Date of Birth" type="date" name="dob" value={form.dob} onChange={handleChange} />

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default DonorSetup;