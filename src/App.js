// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
import {AuthProvider} from './hooks/AuthProvider'
// components
import ScrollToTop from './components/scroll-to-top';
import {StyledChart} from './components/chart';

// ----------------------------------------------------------------------

export default function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <ScrollToTop/>
                <StyledChart/>
                <Router/>
            </AuthProvider>
        </ThemeProvider>
    );
}
