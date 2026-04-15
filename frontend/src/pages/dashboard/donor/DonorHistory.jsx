import { useEffect, useState } from "react";
import API from "../../../api/axios";
import Card from "../../../ui/Card";
import EmptyState from "../../../ui/EmptyState";

function DonorHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get("/donor/history");
        setHistory(res.data.history);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetch();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Donation History</h2>
      <div style={{ marginTop: 16 }}>
        <Card title="History">
          {history.length === 0 ? (
            <EmptyState text="No donations yet" />
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Blood Bank</th>
                  <th>Blood Group</th>
                  <th>Units</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, i) => (
                  <tr key={i}>
                    <td>{formatDate(item.donation_date)}</td>
                    <td>{item.name}</td>
                    <td>{item.blood_grp}</td>
                    <td>{item.units_donated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </div>
  );
}

export default DonorHistory;