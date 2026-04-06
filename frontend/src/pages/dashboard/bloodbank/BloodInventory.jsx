import { useEffect, useState } from "react";
import API from "../../../api/axios";
import Card from "../../../ui/Card";
import Input from "../../../ui/Input";
import Button from "../../../ui/Button";
import EmptyState from "../../../ui/EmptyState";

function BloodInventory() {
  const [data, setData] = useState(null);
  const [adjustments, setAdjustments] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    const res = await API.get("/bloodbank/inventory");
    setData(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  if (!data || loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Blood Inventory</h2>
      {error && <p style={{ color: "var(--color-error)", marginTop: 12 }}>{error}</p>}

      <Card title="Summary by Blood Group" className="" style={{ marginTop: 16 }}>
        {(data.summary || []).length === 0 ? (
          <EmptyState text="No inventory summary yet" />
        ) : (
          <div className="grid grid-3">
            {(data.summary || []).map((item, i) => (
              <Card key={i} title={item.blood_grp} className="">
                <h2>{item.units || 0}</h2>
                <p className="muted">units</p>
              </Card>
            ))}
          </div>
        )}
      </Card>

      <div style={{ marginTop: 16 }}>
        <Card title="Stock Entries">
          {(data.entries || []).length === 0 ? (
            <EmptyState text="No stock entries found" />
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Stock #</th>
                  <th>Blood Group</th>
                  <th>Units</th>
                  <th>Collection Date</th>
                  <th>Adjust</th>
                  <th>Write-off</th>
                </tr>
              </thead>
              <tbody>
                {(data.entries || []).map((item) => (
                  <tr key={`${item.bank_id}-${item.stock_id}`}>
                    <td>{item.stock_id}</td>
                    <td><b>{item.blood_grp}</b></td>
                    <td>{item.units_available}</td>
                    <td>{item.collection_dt}</td>
                    <td style={{ width: 220 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input
                          className="input"
                          type="number"
                          placeholder="+/-"
                          value={adjustments[item.stock_id] || ""}
                          onChange={(e) =>
                            setAdjustments({ ...adjustments, [item.stock_id]: e.target.value })
                          }
                          style={{ width: 90 }}
                        />
                        <Button
                          onClick={async () => {
                            try {
                              setError("");
                              await API.put("/bloodbank/inventory/adjust", {
                                stock_id: item.stock_id,
                                bank_id: item.bank_id,
                                adjustment: Number(adjustments[item.stock_id] || 0),
                                reason: "manual_adjustment",
                              });
                              fetch();
                            } catch (err) {
                              setError("Failed to adjust stock");
                            }
                          }}
                        >
                          Adjust
                        </Button>
                      </div>
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={async () => {
                          try {
                            setError("");
                            await API.delete(`/bloodbank/inventory/${item.stock_id}`);
                            fetch();
                          } catch (err) {
                            setError("Failed to write off stock");
                          }
                        }}
                      >
                        Write-off
                      </Button>
                    </td>
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

export default BloodInventory;