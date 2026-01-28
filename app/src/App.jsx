import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import PageContainer from "./components/layout/PageContainer";

import Dashboard from "./pages/Dashboard";
import Results from "./pages/Results";

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <PageContainer>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/results" element={<Results />} />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PageContainer>
    </div>
  );
}

export default App;
