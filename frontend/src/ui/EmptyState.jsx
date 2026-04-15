export default function EmptyState({ text = "No data found" }) {
  return <div className="empty">{text}</div>;
}

