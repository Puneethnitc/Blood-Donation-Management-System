import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
    const { role, hasBloodBank } = useAuth();

    return (
        <div className="sidebar">
            <div className="sidebar__brand">BDMS</div>

            <NavLink to="/dashboard/profile" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Profile
            </NavLink>

            {/* 🧑 DONOR */}
            {role === "donor" && (
                <>
                    <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Home</NavLink>
                    <NavLink to="/dashboard/history" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>History</NavLink>
                </>
            )}

            {/* 🩸 BLOOD BANK */}
            {role === "blood_bank" && (
                <>
                    <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Dashboard</NavLink>
                    <NavLink to="/dashboard/inventory" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Inventory</NavLink>
                    <NavLink to="/dashboard/requests" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Requests</NavLink>
                    <NavLink to="/dashboard/donations" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Donations</NavLink>
                    <NavLink to="/dashboard/add-donation" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                        Add Donation
                    </NavLink>
                </>
            )}

            {/* 🏥 HOSPITAL (NO BANK) */}
            {role === "hospital" && !hasBloodBank && (
                <>
                    <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Dashboard</NavLink>
                    <NavLink to="/dashboard/request" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Request Blood</NavLink>
                    <NavLink to="/dashboard/my-requests" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>My Requests</NavLink>
                    <NavLink to="/dashboard/find-banks" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Find Banks</NavLink>
                </>
            )}

            {/* 🏥 HOSPITAL (WITH BANK → behaves like blood bank) */}
            {role === "hospital" && hasBloodBank && (
                <>
                    <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Dashboard</NavLink>
                    <NavLink to="/dashboard/request" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Request Blood (External)</NavLink>
                    <NavLink to="/dashboard/my-requests" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Hospital Requests</NavLink>
                    <NavLink to="/dashboard/bank/inventory" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Bank Inventory</NavLink>
                    <NavLink to="/dashboard/bank/requests" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Bank Incoming Requests</NavLink>
                    <NavLink to="/dashboard/bank/donations" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Bank Donations</NavLink>
                    <NavLink to="/dashboard/bank/add-donation" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Bank Add Donation</NavLink>
                </>
            )}
        </div>
    );
}

export default Sidebar;