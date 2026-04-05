import { useEffect, useState } from "react";
import API from "../../../api/axios";

function BloodInventory() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const res = await API.get("/bloodbank/inventory");
      setData(res.data);
    };
    fetch();
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>Blood Inventory</h2>

      {data.map((item, i) => (
        <div key={i} style={card}>
          <h3>{item.blood_grp}</h3>
          <p>{item.units || 0} units</p>
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

export default BloodInventory;