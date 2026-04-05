import { useEffect, useState } from "react";
import API from "../../../api/axios";

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

      <p>Total Requests: {data.total}</p>
      <p>Pending: {data.pending}</p>
    </div>
  );
}

export default HospitalHome;