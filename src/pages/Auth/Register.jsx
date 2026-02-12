import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import useAxios from '../../hooks/useAxios';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FcGoogle } from 'react-icons/fc';
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiUploadCloud } from 'react-icons/fi';
import { GiSewingMachine } from 'react-icons/gi';

const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

const Register = () => {
    const { createUser, updateUserProfile, googleSignIn } = useAuth();
    const axiosPublic = useAxios();
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);

    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const watchPassword = watch('password', '');

    const uploadToImgBB = async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        const { data } = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, formData);
        if (data.success) {
            return data.data.display_url;
        }
        throw new Error('Image upload failed');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data) => {
        try {
            setUploading(true);
            let photoURL = '';
            const fileInput = document.getElementById('photo-upload');
            if (fileInput?.files?.[0]) {
                photoURL = await uploadToImgBB(fileInput.files[0]);
            }

            await createUser(data.email, data.password);
            await updateUserProfile(data.name, photoURL);
            await axiosPublic.post('/users', {
                name: data.name,
                email: data.email,
                photoURL: photoURL,
                role: data.role
            });
            Swal.fire({ icon: 'success', title: 'Registration Successful!', timer: 1500, showConfirmButton: false });
            navigate('/');
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Registration Failed', text: error.message });
        } finally {
            setUploading(false);
        }
    };

    const handleGoogleRegister = async () => {
        try {
            const result = await googleSignIn();
            const user = result.user;
            await axiosPublic.post('/users', {
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                role: 'buyer'
            });
            Swal.fire({ icon: 'success', title: 'Registration Successful!', timer: 1500, showConfirmButton: false });
            navigate('/');
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Registration Failed', text: error.message });
        }
    };

    return (
        <div className="w-full max-w-md mx-4 my-8">
            <div className="card bg-base-100 shadow-lg border border-base-300 rounded-2xl">
                <div className="card-body p-8">
                    <div className="text-center mb-4">
                        <Link to="/" className="inline-flex items-center gap-2 mb-3">
                            <GiSewingMachine className="text-3xl text-primary" />
                            <span className="text-xl font-extrabold"><span className="text-primary">Stitch</span>Track</span>
                        </Link>
                        <h2 className="text-2xl font-bold">Create Account</h2>
                        <p className="text-base-content/50 text-sm mt-1">Join the garment production platform</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-2 block">Your Name</label>
                            <div className="flex items-center gap-3 border border-base-300 rounded-xl px-4 py-3 focus-within:border-primary transition-colors">
                                <FiUser className="text-base-content/30 text-lg shrink-0" />
                                <input type="text" placeholder="Enter your full name" className="bg-transparent outline-none w-full text-sm placeholder:text-base-content/30" {...register('name', { required: 'Name is required' })} />
                            </div>
                            {errors.name && <span className="text-error text-xs mt-1 block">{errors.name.message}</span>}
                        </div>

                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-2 block">E-Mail Address</label>
                            <div className="flex items-center gap-3 border border-base-300 rounded-xl px-4 py-3 focus-within:border-primary transition-colors">
                                <FiMail className="text-base-content/30 text-lg shrink-0" />
                                <input type="email" placeholder="Enter your E-mail address" className="bg-transparent outline-none w-full text-sm placeholder:text-base-content/30" {...register('email', { required: 'Email is required' })} />
                            </div>
                            {errors.email && <span className="text-error text-xs mt-1 block">{errors.email.message}</span>}
                        </div>

                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-2 block">Profile Photo</label>
                            <label htmlFor="photo-upload" className="flex items-center gap-3 border border-base-300 border-dashed rounded-xl px-4 py-4 cursor-pointer hover:border-primary transition-colors group">
                                {preview ? (
                                    <img src={preview} alt="preview" className="w-12 h-12 rounded-full object-cover shrink-0 ring-2 ring-primary/30" />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-base-200 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                                        <FiUploadCloud className="text-base-content/30 text-xl group-hover:text-primary" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <span className="text-sm font-medium block truncate">{preview ? 'Photo selected ✓' : 'Click to upload your photo'}</span>
                                    <span className="text-xs text-base-content/40">JPG, PNG or GIF • Max 32 MB</span>
                                </div>
                            </label>
                            <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </div>

                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-2 block">Register As</label>
                            <div className="flex items-center gap-6 px-1 py-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" value="buyer" className="radio radio-primary radio-sm" defaultChecked {...register('role', { required: 'Role is required' })} />
                                    <span className="text-sm font-medium">Buyer</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" value="manager" className="radio radio-primary radio-sm" {...register('role', { required: 'Role is required' })} />
                                    <span className="text-sm font-medium">Manager</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-2 block">Password</label>
                            <div className="flex items-center gap-3 border border-base-300 rounded-xl px-4 py-3 focus-within:border-primary transition-colors">
                                <FiLock className="text-base-content/30 text-lg shrink-0" />
                                <input type={showPass ? 'text' : 'password'} placeholder="Create a password" className="bg-transparent outline-none w-full text-sm placeholder:text-base-content/30"
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: { value: 6, message: 'Password must be at least 6 characters' },
                                        pattern: {
                                            value: /^(?=.*[a-z])(?=.*[A-Z]).+$/,
                                            message: 'Must contain uppercase and lowercase letters'
                                        }
                                    })}
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="text-base-content/30 hover:text-base-content shrink-0">
                                    {showPass ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            {errors.password && <span className="text-error text-xs mt-1 block">{errors.password.message}</span>}
                        </div>

                        <button type="submit" disabled={uploading} className="btn btn-primary w-full rounded-xl text-base h-12 mt-2">
                            {uploading ? <><span className="loading loading-spinner loading-sm"></span> Uploading…</> : 'Register'}
                        </button>
                    </form>

                    <div className="divider text-xs text-base-content/30 my-4">OR</div>

                    <button onClick={handleGoogleRegister} className="btn btn-outline w-full rounded-xl gap-2 h-12">
                        <FcGoogle className="text-xl" /> Continue with Google
                    </button>

                    <p className="text-center text-sm mt-4 text-base-content/50">
                        Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
