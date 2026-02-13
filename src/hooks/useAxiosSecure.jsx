import axios from 'axios';
import { useEffect } from 'react';
import useAuth from './useAuth';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';

const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL || 'http://localhost:3000'
})

const useAxiosSecure = () => {
    const { user, logOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // intercept request - attach Bearer token
        const reqInterceptor = axiosSecure.interceptors.request.use(config => {
            config.headers.Authorization = `Bearer ${user?.accessToken}`
            return config
        })

        // intercept response - handle 401/403
        const resInterceptor = axiosSecure.interceptors.response.use((response) => {
            return response;
        }, async (error) => {
            const statusCode = error?.response?.status;
            const data = error?.response?.data;
            
            if (statusCode === 403 && data?.message === 'account suspended') {
                await logOut();
                Swal.fire({
                    icon: 'error',
                    title: 'Account Suspended',
                    html: `<p class="mb-2">Reason: <strong>${data.reason}</strong></p>
                           ${data.feedback ? `<p class="text-sm text-gray-500">Feedback: ${data.feedback}</p>` : ''}
                           <p class="mt-4 text-sm">Please contact the administrator to resolve this.</p>`,
                    confirmButtonText: 'Okay'
                });
                navigate('/login');
            } else if (statusCode === 401 || statusCode === 403) {
                logOut()
                    .then(() => {
                        navigate('/login')
                    })
            }
            return Promise.reject(error);
        })

        return () => {
            axiosSecure.interceptors.request.eject(reqInterceptor);
            axiosSecure.interceptors.response.eject(resInterceptor);
        }

    }, [user, logOut, navigate])

    return axiosSecure;
};

export default useAxiosSecure;
