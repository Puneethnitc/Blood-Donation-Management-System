import { useEffect, useState } from "react";
import API from "../../../api/axios";
import Card from "../../../ui/Card";
import EmptyState from "../../../ui/EmptyState";

function AdminDonations() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await API.get("/admin/donations");
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
      <h2>All Donations</h2>
      <div style={{ marginTop: 16 }}>
        <Card title="Donations">
          <table className="table">
            <thead>
              <tr>
                <th>Donation ID</th>
                <th>Donor</th>
                <th>Units</th>
                <th>Date</th>
                <th>Bank</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.donation_id}>
                  <td style={{ fontFamily: "monospace" }}>{d.donation_id}</td>
                  <td>
                    <div style={{ fontWeight: 800 }}>{d.donor_name}</div>
                    <div className="muted" style={{ fontFamily: "monospace", fontSize: 12 }}>
                      {d.donor_id}
                    </div>
                  </td>
                  <td>{d.units}</td>
                  <td>{d.date}</td>
                  <td>
                    <div style={{ fontWeight: 800 }}>{d.bank_name}</div>
                    <div className="muted" style={{ fontFamily: "monospace", fontSize: 12 }}>
                      {d.bank_id}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

export default AdminDonations;

