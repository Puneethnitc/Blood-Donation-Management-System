import { useState } from "react";
import API from "../../../api/axios";
import { useToast } from "../../../context/ToastContext";
import Card from "../../../ui/Card";
import Input from "../../../ui/Input";
import Button from "../../../ui/Button";
import Badge from "../../../ui/Badge";

function AddDonation() {
  const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const [form, setForm] = useState({
    donor_id: "",
    blood_grp: "",
    units: ""
  });

  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  // 🔍 CHECK DONOR
  const checkDonor = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/bloodbank/donor/${form.donor_id}`);
      setStatus(res.data);
    } catch (err) {
      setStatus({ error: "Donor not found" });
    } finally {
      setLoading(false);
    }
  };

  // ➕ SUBMIT
  const handleSubmit = async () => {
    if (!status?.eligible) {
      setError("Donor not eligible");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await API.post("/bloodbank/donation", form);
      showToast("success", "Donation added successfully");

      setForm({ donor_id: "", blood_grp: "", units: "" });
      setStatus(null);

    } catch (err) {
      setError("Error adding donation");
      showToast("error", "Error adding donation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Add Donation</h2>
      {error && <p style={{ color: "var(--color-error)", marginTop: 12 }}>{error}</p>}

      <div style={{ marginTop: 16 }}>
        <Card title="Donation Form">
          <div className="form">
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              <div style={{ flex: 1 }}>
                <Input
                  label="Donor ID"
                  placeholder="e.g. DNR0000001"
                  value={form.donor_id}
                  onChange={(e) => setForm({ ...form, donor_id: e.target.value })}
                />
              </div>
              <Button onClick={checkDonor} disabled={loading || !form.donor_id}>
                {loading ? "Checking..." : "Check"}
              </Button>
            </div>

            {status && (
              <div>
                {status.error && <p style={{ color: "var(--color-error)" }}>{status.error}</p>}
                {status.success && status.eligible && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Badge status="Approved" />
                    <span className="muted">Eligible</span>
                  </div>
                )}
                {status.success && !status.eligible && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Badge status="Pending" />
                    <span className="muted">Not eligible (wait {status.days_left} days)</span>
                  </div>
                )}
              </div>
            )}

            <div className="field">
              <div className="label">Blood Group</div>
              <select
                className="input"
                value={form.blood_grp}
                onChange={(e) => setForm({ ...form, blood_grp: e.target.value })}
              >
                <option value="">Select</option>
                {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>

            <Input
              label="Units"
              type="number"
              placeholder="e.g. 1"
              value={form.units}
              onChange={(e) => setForm({ ...form, units: e.target.value })}
            />

            <Button onClick={handleSubmit} disabled={loading || !form.donor_id || !form.blood_grp || !form.units}>
              {loading ? "Saving..." : "Add Donation"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AddDonation;