import { useAuth } from "../../context/AuthContext";

import DonorHome from "./donor/DonorHome";
import BloodBankHome from "./bloodbank/BloodBankHome";
import HospitalHome from "./hospital/HospitalHome";
import AdminDashboard from "./admin/AdminDashboard";

function DashboardRouter() {
  const { role } = useAuth();

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

  if (role === "hospital") {
    return <HospitalHome />;
  }

  if (role === "blood_bank") {
    return <BloodBankHome />;
  }

  return <p>Unauthorized</p>;
}

export default DashboardRouter;