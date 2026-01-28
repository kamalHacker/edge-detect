import { useLocation, useNavigate } from "react-router-dom";
import ResultsView from "../components/results/ResultsView";

const Results = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.result) {
    navigate("/");
    return null;
  }

  // Normalize results to array
  const results = state.mode === "single"
    ? [state.result]
    : state.result.results;

  const files = state.mode === "single"
    ? [state.file]
    : state.files || [];

  return (
    <ResultsView
      results={results}
      files={files}
    />
  );
};

export default Results;
