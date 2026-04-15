import { useEffect, useState } from "react";
import API from "../../../api/axios";
import Card from "../../../ui/Card";
import EmptyState from "../../../ui/EmptyState";

function AdminUsers() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await API.get("/admin/users");
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
  if (!data || data.length === 0) return <EmptyState text="No users found" />;

  return (
    <div>
      <h2>All Users</h2>
      <div style={{ marginTop: 16 }}>
        <Card title="Users">
          <table className="table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {data.map((u) => (
                <tr key={u.user_id}>
                  <td style={{ fontFamily: "monospace" }}>{u.user_id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone_no}</td>
                  <td>{u.user_type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

export default AdminUsers;

