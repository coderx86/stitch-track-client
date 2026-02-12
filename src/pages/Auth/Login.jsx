import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import useAxios from '../../hooks/useAxios';
import Swal from 'sweetalert2';
import { FcGoogle } from 'react-icons/fc';
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi';
import { GiSewingMachine } from 'react-icons/gi';

const Login = () => {
    const { loginUser, googleSignIn } = useAuth();
    const axios = useAxios();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    const [showPass, setShowPass] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            await loginUser(data.email, data.password);
            Swal.fire({ icon: 'success', title: 'Login Successful!', timer: 1500, showConfirmButton: false });
            navigate(from, { replace: true });
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Login Failed', text: error.message });
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await googleSignIn();
            const user = result.user;
            await axios.post('/users', {
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                role: 'buyer'
            });
            Swal.fire({ icon: 'success', title: 'Login Successful!', timer: 1500, showConfirmButton: false });
            navigate(from, { replace: true });
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Login Failed', text: error.message });
        }
    };

    return (
        <div className="w-full max-w-md mx-4">
            <div className="card bg-base-100 shadow-lg border border-base-300 rounded-2xl">
                <div className="card-body p-8">
                    <div className="text-center mb-4">
                        <Link to="/" className="inline-flex items-center gap-2 mb-3">
                            <GiSewingMachine className="text-3xl text-primary" />
                            <span className="text-xl font-extrabold"><span className="text-primary">Stitch</span>Track</span>
                        </Link>
                        <h2 className="text-2xl font-bold">Welcome Back</h2>
                        <p className="text-base-content/50 text-sm mt-1">Login to your account</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-2 block">E-Mail Address</label>
                            <div className="flex items-center gap-3 border border-base-300 rounded-xl px-4 py-3 focus-within:border-primary transition-colors">
                                <FiMail className="text-base-content/30 text-lg shrink-0" />
                                <input type="email" placeholder="Enter your E-mail address" className="bg-transparent outline-none w-full text-sm placeholder:text-base-content/30" {...register('email', { required: 'Email is required' })} />
                            </div>
                            {errors.email && <span className="text-error text-xs mt-1 block">{errors.email.message}</span>}
                        </div>

                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-2 block">Password</label>
                            <div className="flex items-center gap-3 border border-base-300 rounded-xl px-4 py-3 focus-within:border-primary transition-colors">
                                <FiLock className="text-base-content/30 text-lg shrink-0" />
                                <input type={showPass ? 'text' : 'password'} placeholder="Enter your password" className="bg-transparent outline-none w-full text-sm placeholder:text-base-content/30" {...register('password', { required: 'Password is required' })} />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="text-base-content/30 hover:text-base-content shrink-0">
                                    {showPass ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            {errors.password && <span className="text-error text-xs mt-1 block">{errors.password.message}</span>}
                        </div>

                        <button type="submit" className="btn btn-primary w-full rounded-xl text-base h-12 mt-2">Login</button>
                    </form>

                    <div className="divider text-xs text-base-content/30 my-4">OR</div>

                    <button onClick={handleGoogleLogin} className="btn btn-outline w-full rounded-xl gap-2 h-12">
                        <FcGoogle className="text-xl" /> Continue with Google
                    </button>

                    <p className="text-center text-sm mt-4 text-base-content/50">
                        Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline">Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
