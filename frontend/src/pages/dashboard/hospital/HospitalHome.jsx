import { useEffect, useState } from "react";
import API from "../../../api/axios";
import Card from "../../../ui/Card";

function HospitalHome() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const res = await API.get("/hospital/dashboard");
      setData(res.data);
    };
    fetch();
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>Hospital Dashboard</h2>
      <div className="grid grid-3" style={{ marginTop: 16 }}>
        <Card title="Total Requests">
          <h2>{data.total_requests}</h2>
          <p className="muted">All-time requests</p>
        </Card>
        <Card title="Pending">
          <h2>{data.pending_requests}</h2>
          <p className="muted">Awaiting bank action</p>
        </Card>
        <Card title="Fulfilled">
          <h2>{data.fulfilled_requests}</h2>
          <p className="muted">Completed requests</p>
        </Card>
        <Card title="Cancelled" className="">
          <h2>{data.cancelled_requests}</h2>
          <p className="muted">Cancelled requests</p>
        </Card>
      </div>
    </div>
  );
}

export default HospitalHome;