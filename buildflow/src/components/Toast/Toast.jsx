import './Toast.css';

function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="toast">
      <span className="toast-icon">✓</span>
      <span className="toast-message">{message}</span>
    </div>
  );
}

export default Toast;
