import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

// @mui
import {Stack, IconButton, InputAdornment, TextField, Snackbar} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import {useAuth} from '../../../hooks/useAuth'
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function LoginForm() {
    const navigate = useNavigate();
    const { login } = useAuth()
    const [showPassword, setShowPassword] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const handleClick = async () => {
        const { error } = await login(email, password)

        if(error) {
            setErrorMessage(error)
            setErrorModalOpen(true)
            return
        }

        navigate('/dashboard', {replace: true});
    };

    return (
        <>
            <Stack spacing={3}  sx={{my: 2}}>
                <TextField onChange={(e) => setEmail(e.target.value)} name="email" label="Email address"/>

                <TextField
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}/>
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Stack>

            <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
                Login
            </LoadingButton>
            <Snackbar open={errorModalOpen} onClose={() => setErrorModalOpen(false)} autoHideDuration={5000} message={errorMessage}/>
        </>
    );
}
