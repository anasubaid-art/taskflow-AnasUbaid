import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProjectsPage from "./pages/ProjectsPage";
import BoardPage from "./pages/BoardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage/>} />
      <Route element={<ProtectedRoute/>} >
      <Route element={<AppLayout/>}>
      <Route path="/projects" element={ <ProjectsPage/>} />
      <Route path="/projects/:projectId" element={<BoardPage/>} />
      </Route>
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;