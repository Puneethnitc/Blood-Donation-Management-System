import { useState } from "react";
import API from "../../../api/axios";
import { useToast } from "../../../context/ToastContext";
import Card from "../../../ui/Card";
import Input from "../../../ui/Input";
import Button from "../../../ui/Button";
import EmptyState from "../../../ui/EmptyState";

function FindBloodBanks() {
  const [filters, setFilters] = useState({
    blood_grp: "",
    units_required: ""
  });

  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSearch = async () => {
    try {
      setLoading(true);
      const res = await API.get("/hospital/find-banks", {
        params: filters
      });

      setData(res.data.banks);

    } catch (err) {
      console.error(err);
      setError("Error fetching banks");
      showToast("error", "Error fetching banks");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Find Blood Banks</h2>
      {error && <p style={{ color: "var(--color-error)", marginTop: 12 }}>{error}</p>}

      <div style={{ marginTop: 16 }}>
        <Card title="Search">
          <div className="grid grid-3">
            <div className="field">
              <div className="label">Blood Group</div>
              <select
                className="input"
                value={filters.blood_grp}
                onChange={(e) => setFilters({ ...filters, blood_grp: e.target.value })}
              >
                <option value="">Select</option>
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

            <Input
              label="Units Required"
              placeholder="e.g. 2"
              value={filters.units_required}
              onChange={(e) => setFilters({ ...filters, units_required: e.target.value })}
            />
          </div>

          <div style={{ marginTop: 12 }}>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
        </Card>
      </div>

      <div style={{ marginTop: 16 }}>
        <Card title="Results">
          {data.length === 0 ? (
            <EmptyState text="No blood banks found" />
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Blood Bank</th>
                  <th>Units Available</th>
                  <th>Distance (km)</th>
                </tr>
              </thead>
              <tbody>
                {data.map((b) => (
                  <tr key={b.bank_id}>
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

export default FindBloodBanks;