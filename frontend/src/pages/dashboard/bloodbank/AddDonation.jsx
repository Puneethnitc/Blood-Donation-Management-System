import { useState } from "react";
import API from "../../../api/axios";

function AddDonation() {
  const [form, setForm] = useState({
    donor_id: "",
    blood_grp: "",
    units: ""
  });

  const [status, setStatus] = useState(null);

  // 🔍 CHECK DONOR
  const checkDonor = async () => {
    try {
      const res = await API.get(`/bloodbank/donor/${form.donor_id}`);
      setStatus(res.data);
    } catch (err) {
      setStatus({ error: "Donor not found" });
    }
  };

  // ➕ SUBMIT
  const handleSubmit = async () => {
    if (!status?.eligible) {
      alert("Donor not eligible");
      return;
    }

    try {
      await API.post("/bloodbank/donation", form);
      alert("Donation added!");

      setForm({ donor_id: "", blood_grp: "", units: "" });
      setStatus(null);

    } catch (err) {
      alert("Error adding donation");
    }
  };

  return (
    <div>
      <h2>Add Donation</h2>

      <input
        placeholder="Donor ID"
        value={form.donor_id}
        onChange={(e) => setForm({ ...form, donor_id: e.target.value })}
      />

      <button onClick={checkDonor}>Check</button>

      {status && (
        <div>
          {status.error && <p style={{ color: "red" }}>{status.error}</p>}

          {status.success && status.eligible && (
            <p style={{ color: "green" }}>Eligible ✅</p>
          )}

          {status.success && !status.eligible && (
            <p style={{ color: "orange" }}>
              Not eligible (wait {status.days_left} days)
            </p>
          )}
        </div>
      )}

      <input
        placeholder="Blood Group"
        value={form.blood_grp}
        onChange={(e) => setForm({ ...form, blood_grp: e.target.value })}
      />

      <input
        placeholder="Units"
        type="number"
        value={form.units}
        onChange={(e) => setForm({ ...form, units: e.target.value })}
      />

      <button onClick={handleSubmit}>Add Donation</button>
    </div>
  );
}

export default AddDonation;