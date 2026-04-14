import { useState } from "react";
import API from "../../../api/axios";
import { useToast } from "../../../context/ToastContext";
import Card from "../../../ui/Card";
import Input from "../../../ui/Input";
import Button from "../../../ui/Button";
import EmptyState from "../../../ui/EmptyState";

function HospitalRequest() {
  const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const [form, setForm] = useState({
    blood_grp: "",
    units_required: "",
    priority: 1
  });

  const [banks, setBanks] = useState([]);
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  // 🔍 SEARCH BANKS
  const handleSearch = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await API.get("/hospital/find-banks", {
        params: {
          blood_grp: form.blood_grp,
          units_required: form.units_required
        }
      });

      setBanks(res.data.banks);
    } catch (err) {
      console.error(err);
      setError("Error fetching banks");
    } finally {
      setLoading(false);
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
      setError("Select at least one bank");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await API.post("/hospital/send-request", {
        ...form,
        selected_banks: selectedBanks
      });
      showToast("success", "Blood request sent successfully");

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
      setError("Error sending request");
      showToast("error", "Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Request Blood</h2>
      {error && <p style={{ color: "var(--color-error)", marginTop: 12 }}>{error}</p>}

      <div style={{ marginTop: 16 }}>
        <Card title="Search Blood Banks">
          <div className="grid grid-3">
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
              label="Units Required"
              type="number"
              value={form.units_required}
              onChange={(e) => setForm({ ...form, units_required: e.target.value })}
            />

            <div className="field">
              <div className="label">Priority</div>
              <select
                className="input"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value={1}>High</option>
                <option value={2}>Medium</option>
                <option value={3}>Low</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? "Searching..." : "Search Banks"}
            </Button>
            <Button variant="secondary" onClick={handleSubmit} disabled={loading || selectedBanks.length === 0}>
              Send Request
            </Button>
          </div>
        </Card>
      </div>

      {/* 📋 RESULTS */}
      <div style={{ marginTop: 16 }}>
        <Card title="Results">
          {banks.length === 0 ? (
            <EmptyState text="No banks found yet. Search to see results." />
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Blood Bank</th>
                  <th>Units Available</th>
                  <th>Distance (km)</th>
                </tr>
              </thead>
              <tbody>
                {banks.map((b) => (
                  <tr key={b.bank_id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedBanks.includes(b.bank_id)}
                        onChange={() => toggleBank(b.bank_id)}
                      />
                    </td>
                    <td style={{ fontWeight: 800 }}>{b.bank_name}</td>
                    <td>{b.units_available}</td>
                    <td>{Number(b.distance).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </div>
  );
}

export default HospitalRequest;