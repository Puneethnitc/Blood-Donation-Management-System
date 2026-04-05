import { useState } from "react";
import API from "../../../api/axios";

function HospitalRequest() {
  const [form, setForm] = useState({
    blood_grp: "",
    units_required: "",
    priority: 1
  });

  const [banks, setBanks] = useState([]);
  const [selectedBanks, setSelectedBanks] = useState([]);

  // 🔍 SEARCH BANKS
  const handleSearch = async () => {
    try {
      const res = await API.get("/hospital/find-banks", {
        params: {
          blood_grp: form.blood_grp,
          units_required: form.units_required
        }
      });

      setBanks(res.data.banks);
    } catch (err) {
      console.error(err);
      alert("Error fetching banks");
    }
  };

  // ✅ SELECT BANK
  const toggleBank = (id) => {
    setSelectedBanks(prev =>
      prev.includes(id)
        ? prev.filter(b => b !== id)
        : [...prev, id]
    );
  };

  // 🚀 SEND REQUEST
  const handleSubmit = async () => {
    if (selectedBanks.length === 0) {
      alert("Select at least one bank");
      return;
    }

    try {
      await API.post("/hospital/request", {
        ...form,
        selected_banks: selectedBanks
      });

      alert("Request sent successfully!");

      // reset
      setBanks([]);
      setSelectedBanks([]);
      setForm({
        blood_grp: "",
        units_required: "",
        priority: 1
      });

    } catch (err) {
      console.error(err);
      alert("Error sending request");
    }
  };

  return (
    <div>
      <h2>Request Blood</h2>

      {/* 🔧 FORM */}
      <div style={card}>
        <input
          placeholder="Blood Group (A+, O-, etc)"
          value={form.blood_grp}
          onChange={(e) =>
            setForm({ ...form, blood_grp: e.target.value })
          }
        />

        <input
          placeholder="Units Required"
          type="number"
          value={form.units_required}
          onChange={(e) =>
            setForm({ ...form, units_required: e.target.value })
          }
        />

        <select
          value={form.priority}
          onChange={(e) =>
            setForm({ ...form, priority: e.target.value })
          }
        >
          <option value={1}>High</option>
          <option value={2}>Medium</option>
          <option value={3}>Low</option>
        </select>

        <button onClick={handleSearch}>Search Banks</button>
      </div>

      {/* 📋 RESULTS */}
      {banks.length > 0 && (
        <div style={card}>
          <h3>Select Blood Banks</h3>

          {banks.map((b) => (
            <div key={b.bank_id} style={row}>
              <input
                type="checkbox"
                checked={selectedBanks.includes(b.bank_id)}
                onChange={() => toggleBank(b.bank_id)}
              />

              <div>
                <p><b>{b.bank_name}</b></p>
                <p>Units: {b.units_available}</p>
                <p>Distance: {Number(b.distance).toFixed(2)} km</p>
              </div>
            </div>
          ))}

          <button onClick={handleSubmit}>
            Send Request
          </button>
        </div>
      )}
    </div>
  );
}

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  marginBottom: "20px"
};

const row = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
  borderBottom: "1px solid #eee",
  padding: "10px 0"
};

export default HospitalRequest;