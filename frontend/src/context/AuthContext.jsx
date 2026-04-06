import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [hasBloodBank, setHasBloodBank] = useState(
    localStorage.getItem("hasBloodBank") === "true"
  );
  const [bankId, setBankId] = useState(localStorage.getItem("bankId"));
  const login = (token, role, hasBloodBank, bankId) => {
    setToken(token);
    setRole(role);
    setHasBloodBank(hasBloodBank);
    setBankId(bankId || null);

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("hasBloodBank", hasBloodBank);
    if (bankId) localStorage.setItem("bankId", bankId);
    else localStorage.removeItem("bankId");
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setHasBloodBank(false);
    setBankId(null);

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("hasBloodBank");
    localStorage.removeItem("bankId");
  };

  return (
    // <AuthContext.Provider value={{ token, role, login, logout }}>
    <AuthContext.Provider value={{ token, role, hasBloodBank, bankId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ THIS LINE IS THE FIX
export const useAuth = () => useContext(AuthContext);