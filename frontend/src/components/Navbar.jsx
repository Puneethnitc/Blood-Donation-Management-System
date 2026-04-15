import { useAuth } from "../context/AuthContext";
import Button from "../ui/Button";

function Navbar() {
  const { logout } = useAuth();

  return (
    <div className="topbar">
      <div style={{ fontWeight: 800 }}>Dashboard</div>

      <Button variant="danger" onClick={logout}>
        Logout
      </Button>
    </div>
  );
}

export default Navbar;