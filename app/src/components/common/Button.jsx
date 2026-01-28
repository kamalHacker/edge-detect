const Button = ({ children, variant = "primary", ...props }) => {
  const styles = {
    primary: "bg-primary hover:bg-primaryDark text-white",
    secondary: "bg-white border border-border text-textPrimary hover:bg-surface",
  };

  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-md font-medium transition ${styles[variant]}`}
    >
      {children}
    </button>
  );
};

export default Button;
