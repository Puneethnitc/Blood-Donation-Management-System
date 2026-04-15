import { useEffect, useState } from "react";
import API from "../../../api/axios";
import Card from "../../../ui/Card";
import Badge from "../../../ui/Badge";
import EmptyState from "../../../ui/EmptyState";

function AdminRequests() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await API.get("/admin/requests");
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
      <h2>All Requests</h2>
      <div style={{ marginTop: 16 }}>
        <Card title="Hospital Requests with Bank Status">
          <table className="table">
            <thead>
              <tr>
                <th>Request</th>
                <th>Hospital</th>
                <th>Blood Group</th>
                <th>Units</th>
                <th>Final</th>
                <th>Bank</th>
                <th>Bank Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.map((r, idx) => (
                <tr key={`${r.request_id}-${r.bank_id || "none"}-${idx}`}>
                  <td style={{ fontFamily: "monospace" }}>{String(r.request_id).slice(0, 8)}</td>
                  <td>{r.hospital_name}</td>
                  <td>
                    <b>{r.blood_grp}</b>
                  </td>
                  <td>{r.units_required}</td>
                  <td>{r.final_status ? <Badge status={r.final_status} /> : "—"}</td>
                  <td>{r.bank_name || "—"}</td>
                  <td>{r.request_status ? <Badge status={r.request_status} /> : "—"}</td>
                  <td>{r.requested_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

export default AdminRequests;

