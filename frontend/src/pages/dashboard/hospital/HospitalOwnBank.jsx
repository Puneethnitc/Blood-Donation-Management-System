import { useEffect, useState } from "react";
import API from "../../../api/axios";
import { useToast } from "../../../context/ToastContext";
import Card from "../../../ui/Card";
import Input from "../../../ui/Input";
import Button from "../../../ui/Button";
import EmptyState from "../../../ui/EmptyState";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const PRIORITY_OPTIONS = [
  { value: 1, label: "High" },
  { value: 2, label: "Medium" },
  { value: 3, label: "Low" }
];

function HospitalOwnBank() {
  const [form, setForm] = useState({ blood_grp: "", units: "", priority: 2 });
  const [issueId, setIssueId] = useState(null);
  const [bankInfo, setBankInfo] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bankRes, inventoryRes] = await Promise.all([
          API.get("/ownedbank/dashboard"),
          API.get("/ownedbank/inventory")
        ]);

        setBankInfo({
          bank_id: bankRes.data.bank_id,
          bank_name: bankRes.data.bank_name,
          bank_email: bankRes.data.bank_email
        });
        setInventory(inventoryRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!form.blood_grp || !form.units) {
      setError("Select a blood group and enter units to withdraw.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      const res = await API.post("/ownedbank/use-stock", {
        blood_grp: form.blood_grp,
        units: Number(form.units),
        priority: form.priority
      });
      setIssueId(res.data.issued_id || null);
      showToast("success", "Blood issued from own bank successfully");
      setForm({ blood_grp: "", units: "", priority: 2 });
      const invRes = await API.get("/ownedbank/inventory");
      setInventory(invRes.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to withdraw blood from own bank");
      showToast("error", "Failed to withdraw blood from own bank");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Take Blood from Own Bank</h2>
      {error && <p style={{ color: "var(--color-error)", marginTop: 12 }}>{error}</p>}

      <div style={{ marginTop: 16 }}>
        <Card title="Owned Bank Details">
          {bankInfo ? (
            <div className="grid grid-3">
              <div>
                <p className="muted">Bank Name</p>
                <p style={{ fontWeight: 700 }}>{bankInfo.bank_name || "—"}</p>
              </div>
              <div>
                <p className="muted">Bank ID</p>
                <p style={{ fontWeight: 700, fontFamily: "monospace" }}>{bankInfo.bank_id || "—"}</p>
              </div>
              <div>
                <p className="muted">Bank Email</p>
                <p style={{ fontWeight: 700 }}>{bankInfo.bank_email || "—"}</p>
              </div>
            </div>
          ) : (
            <EmptyState text="Loading bank details..." />
          )}
        </Card>
      </div>

      <div style={{ marginTop: 16 }}>
        <Card title="Inventory Summary">
          {(inventory?.summary || []).length === 0 ? (
            <EmptyState text="No inventory summary found." />
          ) : (
            <div className="grid grid-3">
              {inventory.summary.map((item, i) => (
                <Card key={i} title={item.blood_grp} className="">
                  <h2>{item.units || 0}</h2>
                  <p className="muted">units</p>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div style={{ marginTop: 16 }}>
        <Card title="Stock Entries">
          {(inventory?.entries || []).length === 0 ? (
            <EmptyState text="No stock entries found." />
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Stock #</th>
                  <th>Blood Group</th>
                  <th>Units</th>
                  <th>Collection Date</th>
                </tr>
              </thead>
              <tbody>
                {inventory.entries.map((item) => (
                  <tr key={`${item.bank_id}-${item.stock_id}`}>
                    <td>{item.stock_id}</td>
                    <td><b>{item.blood_grp}</b></td>
                    <td>{item.units_available}</td>
                    <td>{item.collection_dt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>

      <div style={{ marginTop: 16 }}>
        <Card title="Withdraw from Owned Bank">
          <div className="grid grid-3">
            <div className="field">
              <div className="label">Blood Group</div>
              <select
                className="input"
                value={form.blood_grp}
                onChange={(e) => setForm({ ...form, blood_grp: e.target.value })}
              >
                <option value="">Select Group</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <Input
              label="Units"
              type="number"
              value={form.units}
              onChange={(e) => setForm({ ...form, units: e.target.value })}
              min={1}
            />

            <div className="field">
              <div className="label">Priority</div>
              <select
                className="input"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })}
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Issuing..." : "Issue from Own Bank"}
            </Button>
          </div>
        </Card>
      </div>

      <div style={{ marginTop: 16 }}>
        {issueId ? (
          <Card title="Issued Successfully">
            <p>Blood has been issued from your owned bank.</p>
            <p style={{ marginTop: 8 }}><strong>Issue ID:</strong> {String(issueId).slice(0, 8)}</p>
          </Card>
        ) : (
          <EmptyState text="Use this page to withdraw blood from your own bank." />
        )}
      </div>
    </div>
  );
}

export default HospitalOwnBank;
