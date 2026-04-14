import { useEffect, useState } from "react";
import API from "../../../api/axios";
import Card from "../../../ui/Card";
import EmptyState from "../../../ui/EmptyState";

function OwnedBankInventory() {
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetch = async () => {
      const res = await API.get("/ownedbank/inventory");
      setData(res.data);
    };
    fetch();
  }, []);
  if (!data) return <p>Loading...</p>;
  const summaryItems = (data.summary || []).filter((item) => Number(item.units) > 0);

  return (
    <div>
      <h2>Owned Bank Inventory</h2>
      <div style={{ marginTop: 16 }}>
        <Card title="Summary">
          {summaryItems.length === 0 ? (
            <EmptyState text="No inventory data found" />
          ) : (
            <div className="grid grid-3">
              {summaryItems.map((item, i) => (
                <Card key={i} title={item.blood_grp}>
                  <h2>{item.units || 0}</h2>
                  <p className="muted">units</p>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default OwnedBankInventory;
