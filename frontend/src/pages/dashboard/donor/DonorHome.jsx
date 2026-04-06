import { useEffect, useState } from "react";
import API from "../../../api/axios";
import Card from "../../../ui/Card";
import Badge from "../../../ui/Badge";
import EmptyState from "../../../ui/EmptyState";

function DonorHome() {
  const [profile, setProfile] = useState(null);
  const [lastDonation, setLastDonation] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const prof = await API.get("/donor/profile");
      const last = await API.get("/donor/lastdt");

      setProfile(prof.data);
      setLastDonation(last.data);
    };

    fetchData();
  }, []);

  const canDonate = (date) => {
    if (!date) return true;
    const last = new Date(date);
    last.setDate(last.getDate() + 90);
    return new Date() >= last;
  };

  if (!profile) return <p>Loading...</p>;

  const lastDate = lastDonation?.lastDonation?.donation_date || null;
  const eligible = canDonate(lastDate);

  return (
    <div>
      <h2>Donor Home</h2>

      <div className="grid grid-2" style={{ marginTop: 16 }}>
        <Card title="Profile">
          <p style={{ fontWeight: 800, fontSize: 18 }}>{profile?.name}</p>
          <p className="muted" style={{ marginTop: 6 }}>Blood Group: <b style={{ color: "var(--color-text)" }}>{profile?.blood_grp}</b></p>
        </Card>

        <Card title="Donation Eligibility">
          <p className="muted">Last donation date</p>
          {lastDate ? <p style={{ marginTop: 6, fontWeight: 700 }}>{lastDate}</p> : <EmptyState text="No donations yet" />}
          <div style={{ marginTop: 10 }}>
            <Badge status={eligible ? "Approved" : "Rejected"} />
            <span className="muted" style={{ marginLeft: 10 }}>
              {eligible ? "Eligible" : "Not Eligible"}
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default DonorHome;