import './App.css';
import Header from './pages/header/Header';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import NotFound from './pages/error/NotFound';
import PostParticipant from './pages/ecc/forms/PostParticipant';
import GetAllParticipants from './pages/ecc/participant/GetAllParticipants';
import UpdateParticipant from './pages/ecc/participant/UpdateParticipant';
import Registration from './pages/ecc/registration/Registration';
import ViewParticipant from './pages/ecc/participant/ViewParticipant';
import RegisterParticipant from './pages/ecc/participant/RegisterParticipant';

function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route  path="/" element={<Dashboard />} />
        <Route  path="/registration" element={<Registration />} />
        <Route  path="/participants" element={<GetAllParticipants />} />
        <Route  path="/participant/UpdateParticipant/:id" element={<UpdateParticipant />} />
        <Route  path="/participant/ViewParticipant/:id" element={<ViewParticipant />} />
        <Route  path="/participant/RegisterParticipant/:id" element={<RegisterParticipant />} />
        <Route  path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
