import { useAuth } from "../../context/AuthContext";

import DonorHome from "./donor/DonorHome";
import BloodBankHome from "./bloodbank/BloodBankHome";
import HospitalHome from "./hospital/HospitalHome";
function DashboardRouter() {
  const { role, hasBloodBank } = useAuth();

  // 🔥 WAIT until auth loads
  if (!role) {
    return <p>Loading...</p>;
  }

  if (role === "donor") {
    return <DonorHome />;
  }

  if (role === "hospital" && hasBloodBank === false) {
    return <HospitalHome />;
  }

  if (role === "hospital" && hasBloodBank === true) {
    return <BloodBankHome />;
  }

  if (role === "blood_bank") {
    return <BloodBankHome />;
  }

  return <p>Unauthorized</p>;
}

export default DashboardRouter;