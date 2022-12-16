import { Navigate, useRoutes } from 'react-router-dom';
import { RequireAuth } from './hooks/useAuth'
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import {StudentsProvider} from "./hooks/students/StudentsProvider";
import {StudentProvider} from "./hooks/student/StudentProvider";
import Agenda from "./pages/Agenda";
import ProfessorsPage from "./pages/ProfessorsPage";
import {ProfessorsProvider} from "./hooks/professors/ProfessorsProvider";
import {AgendaProvider} from "./hooks/agenda/AgendaProvider";
import {ProfessorProvider} from "./hooks/professor/ProfessorProvider";

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: 'dashboard',
      element: <RequireAuth> <DashboardLayout /> </RequireAuth>,
      children: [
        { element: <Navigate to="/dashboard/agenda" />, index: true },
        { path: 'students', element:
          <StudentsProvider>
            <StudentProvider>
              <UserPage />
            </StudentProvider>
          </StudentsProvider>
        },
        { path: 'professors', element:
            <ProfessorsProvider>
              <ProfessorProvider>
                <ProfessorsPage />
              </ProfessorProvider>
            </ProfessorsProvider>
        },
        { path: 'reports', element: <StudentsProvider><UserPage /></StudentsProvider> },
        { path: 'agenda', element: <AgendaProvider><ProfessorsProvider><StudentsProvider><Agenda /></StudentsProvider></ProfessorsProvider></AgendaProvider> },
        { path: 'gate', element: <BlogPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <RequireAuth><SimpleLayout /></RequireAuth>,
      children: [
        { element: <Navigate to="/dashboard/agenda" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
