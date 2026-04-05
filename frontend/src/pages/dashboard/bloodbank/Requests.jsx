import { useEffect, useState } from "react";
import API from "../../../api/axios";

function Requests() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const res = await API.get("/bloodbank/requests");
    setData(res.data);
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
      alert("Error processing request");
    }
  };

  return (
    <div>
      <h2>Incoming Requests</h2>

      {data.map((req) => (
        <div key={req.request_id} style={card}>
          <h3>{req.hospital_name}</h3>
          <p>{req.blood_grp} ({req.units} units)</p>
          <p>Status: {req.status}</p>

          {req.status === "Processing" && (
            <>
              <button onClick={() => handleAction(req, "fulfill")}>
                Fulfill
              </button>

              <button onClick={() => handleAction(req, "reject")}>
                Reject
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

const card = {
  background: "white",
  padding: "15px",
  marginBottom: "10px",
  borderRadius: "8px"
};

export default Requests;