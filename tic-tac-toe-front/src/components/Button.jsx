export default function Button({ children, onClick, disabled }) {
  return (
    <button
      onClick={disabled ? () => {} : onClick}
      className="px-4 py-1 bg-prim rounded text-white uppercase font-semibold"
    >
      {children}
    </button>
  );
}
