import { useEffect, useState } from "react";
import API from "../../../api/axios";
import { useToast } from "../../../context/ToastContext";
import Card from "../../../ui/Card";
import Badge from "../../../ui/Badge";
import Button from "../../../ui/Button";
import EmptyState from "../../../ui/EmptyState";

function Requests() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      const res = await API.get("/bloodbank/requests");
      setData(res.data);
    } catch (err) {
      setError("Failed to load requests");
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 8000); // auto refresh
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (req, action) => {
    try {
      await API.post(`/bloodbank/request/${req.request_id}/${action}`);
      fetchData();
    } catch (err) {
      setError("Error processing request");
      showToast("error", "Failed to process request");
    }
  };

  return (
    <div>
      <h2>Incoming Requests</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {data.length === 0 && <p>No data found</p>}

      <div style={{ marginTop: 16 }}>
        <Card title="Requests">
          {data.length === 0 ? (
            <EmptyState text="No incoming requests yet" />
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Hospital</th>
                  <th>Blood Group</th>
                  <th>Units</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((req) => (
                  <tr key={req.request_id}>
                    <td>{req.hospital_name}</td>
                    <td><b>{req.blood_grp}</b></td>
                    <td>{req.units}</td>
                    <td><Badge status={req.status} /></td>
                    <td>
                      {req.status === "Processing" ? (
                        <div style={{ display: "flex", gap: 8 }}>
                          <Button onClick={() => handleAction(req, "fulfill")}>Fulfill</Button>
                          <Button variant="danger" onClick={() => handleAction(req, "reject")}>Reject</Button>
                        </div>
                      ) : (
                        <span className="muted">—</span>
                      )}
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

export default Requests;