import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

import DonorHome from "./donor/DonorHome";
import BloodBankHome from "./bloodbank/BloodBankHome";
import HospitalHome from "./hospital/HospitalHome";
import AdminDashboard from "./admin/AdminDashboard";
function DashboardRouter() {
  const { role, hasBloodBank } = useAuth();
  const [mode, setMode] = useState("hospital");

  // 🔥 WAIT until auth loads
  if (!role) {
    return <p>Loading...</p>;
  }

  if (role === "donor") {
    return <DonorHome />;
  }

  if (role === "admin") {
    return <AdminDashboard />;
  }

  if (role === "hospital" && hasBloodBank === false) {
    return <HospitalHome />;
  }

  if (role === "hospital" && hasBloodBank === true) {
    return (
      <div>
        <button onClick={() => setMode((m) => (m === "hospital" ? "bank" : "hospital"))}>
          {mode === "hospital" ? "Switch to Blood Bank View" : "Switch to Hospital View"}
        </button>
        {mode === "hospital" ? <HospitalHome /> : <BloodBankHome />}
      </div>
    );
  }

  if (role === "blood_bank") {
    return <BloodBankHome />;
  }

  return <p>Unauthorized</p>;
}

export default DashboardRouter;