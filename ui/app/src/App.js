import './App.css';
import Header from './pages/header/Header';
import { Route, Routes, useLocation } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import NotFound from './pages/error/NotFound';
import PostParticipant from './pages/ecc/forms/PostParticipant';
import GetAllParticipants from './pages/ecc/participant/GetAllParticipants';
import UpdateParticipant from './pages/ecc/participant/UpdateParticipant';
import Registration from './pages/ecc/registration/Registration';
import ViewParticipant from './pages/ecc/participant/ViewParticipant';
import RegisterParticipant from './pages/ecc/participant/RegisterParticipant';
import ExpiringReportGenerator from './pages/report/ExpiringReportGenerator';
import GetSubmissions from './pages/ecc/submissions/GetSubmissions';
import Login from './pages/login/Login';

function App() {

  const location = useLocation();

  // Hide header specifically on the /Login route
  const hideHeader = location.pathname.toLowerCase() === '/login';

  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/reports" element={<ExpiringReportGenerator />} />
        <Route path="/participants" element={<GetAllParticipants />} />
        <Route path="/submissions" element={<GetSubmissions />} />
        <Route path="/participant/UpdateParticipant/:id" element={<UpdateParticipant />} />
        <Route path="/participant/ViewParticipant/:id" element={<ViewParticipant />} />
        <Route path="/participant/RegisterParticipant/:id" element={<RegisterParticipant />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
