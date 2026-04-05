import { useState } from "react";
import API from "../../../api/axios";

function FindBloodBanks() {
  const [filters, setFilters] = useState({
    blood_grp: "",
    units_required: ""
  });

  const [data, setData] = useState([]);

  const handleSearch = async () => {
    try {
      const res = await API.get("/hospital/find-banks", {
        params: filters
      });

      setData(res.data.banks);

    } catch (err) {
      console.error(err);
      alert("Error fetching banks");
    }
  };

  return (
    <div>
      <h2>Find Blood Banks</h2>

      {/* Filters */}
      <input
        placeholder="Blood Group"
        onChange={(e) =>
          setFilters({ ...filters, blood_grp: e.target.value })
        }
      />

      <input
        placeholder="Units Required"
        onChange={(e) =>
          setFilters({ ...filters, units_required: e.target.value })
        }
      />

      <button onClick={handleSearch}>Search</button>

      {/* Results */}
      {data.map((b) => (
        <div key={b.bank_id} style={card}>
          <h3>{b.bank_name}</h3>
          <p>Units: {b.units_available}</p>
          <p>Distance: {b.distance.toFixed(2)} km</p>
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

export default FindBloodBanks;