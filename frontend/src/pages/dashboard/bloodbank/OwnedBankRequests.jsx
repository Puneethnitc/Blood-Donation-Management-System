import { useEffect, useState } from "react";
import API from "../../../api/axios";
import { useToast } from "../../../context/ToastContext";

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
      <h2>Owned Bank Requests</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {data.length === 0 && <p>No data found</p>}
      {data.map((req) => (
        <div key={req.request_id}>
          <p>{req.hospital_name} - {req.blood_grp} ({req.units})</p>
          <p>Status: {req.status}</p>
          {req.status === "Processing" && (
            <>
              <button onClick={() => handleAction(req, "fulfill")}>Fulfill</button>
              <button onClick={() => handleAction(req, "reject")}>Reject</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default OwnedBankRequests;
