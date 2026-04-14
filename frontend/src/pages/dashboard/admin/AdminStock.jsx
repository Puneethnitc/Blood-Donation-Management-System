import { useEffect, useState } from "react";
import API from "../../../api/axios";
import Card from "../../../ui/Card";
import EmptyState from "../../../ui/EmptyState";

function AdminStock() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await API.get("/admin/stock");
        setData(res.data.data || []);
      } catch (err) {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!data || data.length === 0) return <EmptyState text="No data found" />;

  return (
    <div>
      <h2>Stock</h2>
      <div style={{ marginTop: 16 }}>
        <Card title="Aggregated Blood Stock">
          <table className="table">
            <thead>
              <tr>
                <th>Bank</th>
                <th>Blood Group</th>
                <th>Units</th>
              </tr>
            </thead>
            <tbody>
              {data.map((s, idx) => (
                <tr key={`${s.bank_id}-${s.blood_grp}-${idx}`}>
                  <td>{s.bank_name}</td>
                  <td>
                    <b>{s.blood_grp}</b>
                  </td>
                  <td>{s.units}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

export default AdminStock;

