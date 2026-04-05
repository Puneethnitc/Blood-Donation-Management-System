import { useEffect, useState } from "react";
import API from "../../../api/axios";

function BloodBankHome() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/bloodbank");
        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>Dashboard</h2>

      <div style={row}>
        <Card title="Total Units" value={data.total_units} />
        <Card title="Pending Requests" value={data.pending_requests} />
        <Card title="Donations This Month" value={data.donations_this_month} />
      </div>

      {data.low_stock?.length > 0 && (
        <div style={alert}>
          <b>Low Stock:</b>
          {data.low_stock.map((b, i) => (
            <p key={i}>{b.blood_grp} ({b.units})</p>
          ))}
        </div>
      )}
    </div>
  );
}

const Card = ({ title, value }) => (
  <div style={card}>
    <h3>{value}</h3>
    <p>{title}</p>
  </div>
);

const row = { display: "flex", gap: "20px" };
const card = { background: "#fff", padding: "20px", borderRadius: "10px" };
const alert = { background: "#fee2e2", padding: "10px", marginTop: "10px" };

export default BloodBankHome;