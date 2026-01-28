const Pagination = ({ total, current, onChange, maxVisible = 5 }) => {
  if (total <= 1) return null;

  const half = Math.floor(maxVisible / 2);

  let start = Math.max(0, current - half);
  let end = Math.min(total, start + maxVisible);

  if (end - start < maxVisible) {
    start = Math.max(0, end - maxVisible);
  }

  const pages = Array.from({ length: end - start }, (_, i) => start + i);

  return (
    <div className="flex items-center gap-2">
      {/* PREV */}
      <button
        disabled={current === 0}
        onClick={() => onChange(current - 1)}
        className="px-3 py-2 rounded-lg text-sm font-medium btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
      >
        Prev
      </button>

      {/* PAGE NUMBERS */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onChange(page)}
          className={`w-9 h-9 rounded-lg text-sm font-semibold transition
            ${
              current === page
                ? "btn-primary"
                : "btn-secondary"
            }
          `}
        >
          {page + 1}
        </button>
      ))}

      {/* NEXT */}
      <button
        disabled={current === total - 1}
        onClick={() => onChange(current + 1)}
        className="px-3 py-2 rounded-lg text-sm font-medium btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
