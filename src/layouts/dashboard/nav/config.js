// component
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import BadgeIcon from '@mui/icons-material/Badge';
import KeyIcon from '@mui/icons-material/Key';

// ----------------------------------------------------------------------

const navConfig = [
  {
    title: 'Agenda',
    path: '/dashboard/agenda',
    icon: <EventAvailableIcon />,
  },
  {
    title: 'Alunos',
    path: '/dashboard/students',
    icon: <AccountBoxIcon />,
  },
  {
    title: 'Professores',
    path: '/dashboard/professors',
    icon: <BadgeIcon />,
  },
  {
    title: 'Relatórios',
    path: '/dashboard/reports',
    icon: <ContactMailIcon />,
  }
];

export default navConfig;
