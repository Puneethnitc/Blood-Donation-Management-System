import { useEffect, useState } from "react";
import API from "../../../api/axios";

function HospitalRequests() {
  const [data, setData] = useState([]);

 useEffect(() => {
  const fetch = async () => {
    const res = await API.get("/hospital/requests");
    console.log(res.data);
    setData(res.data);
  };
  fetch();
}, []);

  return (
    <div>
      <h2>My Requests</h2>

      {data.map((req) => (
        <div key={req.request_id} style={card}>
          
          {/* 🔥 MAIN REQUEST */}
          <h3>Request ID: {req.request_id.slice(0, 8)}</h3>
          <p><b>Blood:</b> {req.blood_grp}</p>
          <p><b>Units:</b> {req.units_required}</p>
          <p><b>Status:</b> {req.final_status}</p>

          {/* 🏦 BANK RESPONSES */}
          <div style={inner}>
            <h4>Bank Responses</h4>

            {req.banks.map((b) => (
              <div key={b.bank_id} style={row}>
                <p>{b.bank_name}</p>
                <span style={getStatusStyle(b.status)}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>

        </div>
      ))}
    </div>
  );
}

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  marginBottom: "20px"
};

const inner = {
  marginTop: "10px",
  borderTop: "1px solid #eee",
  paddingTop: "10px"
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  padding: "8px 0"
};

// 🎨 STATUS COLORS
const getStatusStyle = (status) => {
  const base = {
    padding: "4px 10px",
    borderRadius: "6px",
    color: "white"
  };

  if (status === "Approved") return { ...base, background: "green" };
  if (status === "Rejected") return { ...base, background: "red" };
  return { ...base, background: "orange" }; // Processing
};

export default HospitalRequests;