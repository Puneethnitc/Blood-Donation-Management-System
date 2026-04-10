import { useEffect, useState } from "react";
import API from "../../../api/axios";
import { useToast } from "../../../context/ToastContext";
import Card from "../../../ui/Card";
import Badge from "../../../ui/Badge";
import Button from "../../../ui/Button";
import EmptyState from "../../../ui/EmptyState";

function OwnedBankRequests() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      const res = await API.get("/ownedbank/requests");
      setData(res.data);
    } catch (err) {
      setError("Failed to load requests");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (req, action) => {
    try {
      await API.post(`/ownedbank/request/${req.request_id}/${action}`);
      showToast("success", `Request ${action}ed successfully`);
      fetchData();
    } catch (err) {
      setError("Failed to process request");
      showToast("error", "Failed to process request");
    }
  };

  return (
    <div>
      <h2>Take Blood from Own Bank</h2>
      {error && <p style={{ color: "var(--color-error)", marginTop: 12 }}>{error}</p>}
      <Card title="Hospital Bank Requests">
        {data.length === 0 ? (
          <EmptyState text="No incoming requests for your owned blood bank." />
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Hospital</th>
                <th>Blood Group</th>
                <th>Units</th>
                <th>Status</th>
                <th>Issue ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((req) => (
                <tr key={req.request_id}>
                  <td style={{ fontFamily: "monospace" }}>{String(req.request_id).slice(0, 8)}</td>
                  <td>{req.hospital_name}</td>
                  <td><b>{req.blood_grp}</b></td>
                  <td>{req.units}</td>
                  <td><Badge status={req.status} /></td>
                  <td>{req.issued_id ? String(req.issued_id).slice(0, 8) : "—"}</td>
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
  );
}

export default OwnedBankRequests;
