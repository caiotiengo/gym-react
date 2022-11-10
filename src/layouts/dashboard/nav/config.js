// component
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import KeyIcon from '@mui/icons-material/Key';

// ----------------------------------------------------------------------

const navConfig = [
  {
    title: 'Alunos',
    path: '/dashboard/students',
    icon: <AccountBoxIcon />,
  },
  {
    title: 'Relatórios',
    path: '/dashboard/reports',
    icon: <ContactMailIcon />,
  },
  {
    title: 'Agenda',
    path: '/dashboard/agenda',
    icon: <EventAvailableIcon />,
  },
  {
    title: 'Catraca',
    path: '/dashboard/gate',
    icon: <KeyIcon />,
  },
];

export default navConfig;
