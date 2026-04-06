export default function Button({ variant, className = "", ...props }) {
  const v =
    variant === "danger" ? "danger" : variant === "secondary" ? "secondary" : "";
  return <button className={`btn ${v} ${className}`} {...props} />;
}

