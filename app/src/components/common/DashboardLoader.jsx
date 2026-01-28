const DashboardLoader = ({ count }) => {
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm
                    flex flex-col items-center justify-center gap-4">
      <div className="w-14 h-14 border-4 border-border border-t-primary rounded-full animate-spin" />
      <p className="text-textSecondary text-sm">
        Processing {count} image{count > 1 ? "s" : ""}…
      </p>
    </div>
  );
};

export default DashboardLoader;