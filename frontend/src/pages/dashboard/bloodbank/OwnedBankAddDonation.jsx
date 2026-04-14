import { useState } from "react";
import API from "../../../api/axios";
import { useToast } from "../../../context/ToastContext";

function OwnedBankAddDonation() {
  const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const [form, setForm] = useState({ donor_id: "", blood_grp: "", units: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      await API.post("/ownedbank/donation", form);
      setForm({ donor_id: "", blood_grp: "", units: "" });
      showToast("success", "Donation added successfully");
    } catch (err) {
      setError("Error adding donation");
      showToast("error", "Error adding donation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Owned Bank Add Donation</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input value={form.donor_id} placeholder="Donor ID" onChange={(e) => setForm({ ...form, donor_id: e.target.value })} />
      <select value={form.blood_grp} onChange={(e) => setForm({ ...form, blood_grp: e.target.value })}>
        <option value="">Select Blood Group</option>
        {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
      </select>
      <input type="number" value={form.units} placeholder="Units" onChange={(e) => setForm({ ...form, units: e.target.value })} />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Adding..." : "Add Donation"}
      </button>
    </div>
  );
}

export default OwnedBankAddDonation;
