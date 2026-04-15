import { useEffect, useState } from "react";
import API from "../../../api/axios";
import Card from "../../../ui/Card";
import EmptyState from "../../../ui/EmptyState";

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await API.get("/admin/dashboard");
        setData(res.data.data || {});
      } catch (err) {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!data) return <EmptyState text="No data found" />;

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div className="grid grid-3" style={{ marginTop: 16 }}>
        <Card title="Users">
          <h2>{data.users}</h2>
        </Card>
        <Card title="Donors">
          <h2>{data.donors}</h2>
        </Card>
        <Card title="Hospitals">
          <h2>{data.hospitals}</h2>
        </Card>
        <Card title="Banks">
          <h2>{data.banks}</h2>
        </Card>
        <Card title="Donations">
          <h2>{data.donations}</h2>
        </Card>
        <Card title="Requests">
          <h2>{data.requests}</h2>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard;

