const Toggle = ({ options, value, onChange }) => {
  return (
    <div className="inline-flex rounded-md gap-2 p-1">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-3 py-1 text-sm rounded-lg min-w-[100px] transition
            ${value === opt
              ? "btn-primary"
              : "btn-secondary"}
          `}
        >
          {opt[0].toUpperCase() + opt.slice(1)} Edge
        </button>
      ))}
    </div>
  );
};

export default Toggle;
