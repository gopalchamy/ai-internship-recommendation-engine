import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AILanding from "./pages/AILanding";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Layouts
import UserLayout from "./layouts/UserLayout";
import CompanyLayout from "./layouts/CompanyLayout";
import AdminLayout from "./layouts/AdminLayout";

// User Pages
import MyResumes from "./pages/user/MyResumes";
import JobsList from "./pages/user/JobsList";
import JobMatcher from "./pages/user/JobMatcher";
import AppliedJobs from "./pages/user/AppliedJobs";

// Company Pages
import CompanyOverview from "./pages/company/CompanyOverview";
import PostJob from "./pages/company/PostJob";
import ManageJobs from "./pages/company/ManageJobs";

// Admin Pages
import AdminOverview from "./pages/admin/AdminOverview";
import ManageCompanies from "./pages/admin/ManageCompanies";
import ManageUsers from "./pages/admin/ManageUsers";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<AILanding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* User Routes */}
      <Route
        path="/user"
        element={
          user?.role === "user" ? <UserLayout /> : <Navigate to="/login" />
        }
      >
        <Route index element={<MyResumes />} />
        <Route path="jobs" element={<JobsList />} />
        <Route path="applied" element={<AppliedJobs />} />
        <Route path="matcher" element={<JobMatcher />} />
      </Route>

      {/* Company Routes */}
      <Route
        path="/company"
        element={
          user?.role === "company" ? (
            <CompanyLayout />
          ) : (
            <Navigate to="/login" />
          )
        }
      >
        <Route index element={<CompanyOverview />} />
        <Route path="post-job" element={<PostJob />} />
        <Route path="manage-jobs" element={<ManageJobs />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          user?.role === "admin" ? <AdminLayout /> : <Navigate to="/login" />
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="companies" element={<ManageCompanies />} />
        <Route path="users" element={<ManageUsers />} />
      </Route>
    </Routes>
  );
}

export default App;
