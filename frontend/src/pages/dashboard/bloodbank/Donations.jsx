import { useEffect, useState } from "react";
import API from "../../../api/axios";

function Donations() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await API.get("/bloodbank/donations");
      setData(res.data);
    };
    fetch();
  }, []);

  return (
    <div>
      <h2>Donation Records</h2>

      {data.map((d) => (
        <div key={d.donation_id} style={card}>
          <p><b>{d.donor_name}</b></p>
          <p>{d.units} units</p>
          <p>{d.date}</p>
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

export default Donations;