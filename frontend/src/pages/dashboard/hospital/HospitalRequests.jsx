import { useEffect, useState } from "react";
import API from "../../../api/axios";
import { useToast } from "../../../context/ToastContext";
import Card from "../../../ui/Card";
import Badge from "../../../ui/Badge";
import Button from "../../../ui/Button";
import EmptyState from "../../../ui/EmptyState";

function HospitalRequests() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  const fetch = async () => {
    try {
      setError("");
      const res = await API.get("/hospital/requests");
      setData(res.data);
    } catch (err) {
      setError("Failed to load requests");
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleCancel = async (requestId) => {
    try {
      await API.put(`/hospital/cancel/${requestId}`);
      showToast("warning", "Request cancelled successfully");
      fetch();
    } catch (err) {
      setError("Failed to cancel request");
      showToast("error", "Failed to cancel request");
    }
  };

  return (
    <div>
      <h2>My Requests</h2>
      {error && <p style={{ color: "var(--color-error)", marginTop: 12 }}>{error}</p>}
      {data.length === 0 && <EmptyState text="No requests yet" />}

      {data.map((req) => (
        <Card key={req.request_id} title={`Request #${req.request_id.slice(0, 8)}`}>
          <div className="grid grid-2">
            <div>
              <p className="muted">Blood Group</p>
              <p style={{ fontWeight: 800 }}>{req.blood_grp}</p>
            </div>
            <div>
              <p className="muted">Units Required</p>
              <p style={{ fontWeight: 800 }}>{req.units_required}</p>
            </div>
          </div>

          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
            <Badge status={req.final_status} />
            {req.final_status === "Pending" && (
              <Button variant="danger" onClick={() => handleCancel(req.request_id)}>
                Cancel Request
              </Button>
            )}
          </div>

          <div style={{ marginTop: 16 }}>
            <h4 style={{ marginBottom: 8 }}>Bank Responses</h4>
            <table className="table">
              <thead>
                <tr>
                  <th>Blood Bank</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {req.banks.map((b) => (
                  <tr key={b.bank_id}>
                    <td>
                      {b.bank_name}
                      {b.status === "Approved" && b.issued_id ? (
                        <span style={{ marginLeft: 8, fontSize: 12, color: "var(--color-muted)" }}>
                          Issue #{String(b.issued_id).slice(0, 8)}
                        </span>
                      ) : null}
                    </td>
                    <td><Badge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default HospitalRequests;