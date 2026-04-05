import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
    const { role, hasBloodBank } = useAuth();

    const linkStyle = ({ isActive }) => ({
        color: isActive ? "#38bdf8" : "white",
        textDecoration: "none",
        padding: "8px 10px",
        borderRadius: "6px",
        background: isActive ? "#1e293b" : "transparent"
    });

    return (
        <div style={sidebar}>
            <h2 style={{ marginBottom: "20px" }}>BDMS</h2>

            {/* 🧑 DONOR */}
            {role === "donor" && (
                <>
                    <NavLink to="/dashboard" style={linkStyle}>Home</NavLink>
                    <NavLink to="/dashboard/profile" style={linkStyle}>Profile</NavLink>
                    <NavLink to="/dashboard/history" style={linkStyle}>History</NavLink>
                </>
            )}

            {/* 🩸 BLOOD BANK */}
            {role === "blood_bank" && (
                <>
                    <NavLink to="/dashboard" style={linkStyle}>Dashboard</NavLink>
                    <NavLink to="/dashboard/inventory" style={linkStyle}>Inventory</NavLink>
                    <NavLink to="/dashboard/requests" style={linkStyle}>Requests</NavLink>
                    <NavLink to="/dashboard/donations" style={linkStyle}>Donations</NavLink>
                    <NavLink to="/dashboard/add-donation" style={linkStyle}>
                        Add Donation
                    </NavLink>
                </>
            )}

            {/* 🏥 HOSPITAL (NO BANK) */}
            {role === "hospital" && !hasBloodBank && (
                <>
                    <NavLink to="/dashboard" style={linkStyle}>Dashboard</NavLink>
                    <NavLink to="/dashboard/request" style={linkStyle}>Request Blood</NavLink>
                    <NavLink to="/dashboard/my-requests" style={linkStyle}>My Requests</NavLink>
                </>
            )}

            {/* 🏥 HOSPITAL (WITH BANK → behaves like blood bank) */}
            {role === "hospital" && hasBloodBank && (
                <>
                    <NavLink to="/dashboard" style={linkStyle}>Dashboard</NavLink>
                    <NavLink to="/dashboard/inventory" style={linkStyle}>Inventory</NavLink>
                    <NavLink to="/dashboard/requests" style={linkStyle}>Incoming Requests</NavLink>
                    <NavLink to="/dashboard/donations" style={linkStyle}>Donations</NavLink>
                </>
            )}
        </div>
    );
}

const sidebar = {
    width: "220px",
    background: "#111",
    color: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    height: "100vh"
};

export default Sidebar;