import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute, { homePathFor } from './components/ProtectedRoute';
import { Spinner } from './components/ui';
import { useAuth } from './context/AuthContext';
import ApplicantsPage from './pages/company/ApplicantsPage';
import CompanyJobsPage from './pages/company/CompanyJobsPage';
import CreateJobPage from './pages/company/CreateJobPage';
import JobDetailPage from './pages/job-seeker/JobDetailPage';
import JobsPage from './pages/job-seeker/JobsPage';
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import MyApplicationsPage from './pages/job-seeker/MyApplicationsPage';
import RegisterPage from './pages/public/RegisterPage';

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return <Navigate to={user ? homePathFor(user.role) : '/login'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<Layout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute role="JOB_SEEKER" />}>
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/my-applications" element={<MyApplicationsPage />} />
        </Route>

        <Route element={<ProtectedRoute role="COMPANY" />}>
          <Route path="/company/jobs" element={<CompanyJobsPage />} />
          <Route path="/company/jobs/new" element={<CreateJobPage />} />
          <Route path="/company/jobs/:id/applicants" element={<ApplicantsPage />} />
        </Route>

        <Route path="*" element={<HomeRedirect />} />
      </Route>
    </Routes>
  );
}
