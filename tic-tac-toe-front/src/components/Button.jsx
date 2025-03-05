export default function Button({ children, onClick, disabled }) {
  return (
    <button
      onClick={disabled ? () => {} : onClick}
      className="p-2 bg-prim rounded text-white uppercase font-semibold"
    >
      {children}
    </button>
  );
}
