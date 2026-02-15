import useAuth from '../../hooks/useAuth';
import useRole from '../../hooks/useRole';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { FiUser, FiImage, FiMail } from 'react-icons/fi';
import axios from 'axios';
import { useState } from 'react';

const Profile = () => {
    const { user, updateUserProfile } = useAuth();
    const { role } = useRole();
    const [uploading, setUploading] = useState(false);
    const { register, handleSubmit, setValue, watch } = useForm({
        defaultValues: {
            name: user?.displayName || '',
            photoURL: user?.photoURL || ''
        }
    });
    
    const currentPhoto = watch('photoURL');

    const onSubmit = async (data) => {
        try {
            await updateUserProfile(data.name, data.photoURL);
            Swal.fire({ icon: 'success', title: 'Profile Updated!', timer: 1500, showConfirmButton: false });
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Update Failed', text: error.message });
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-extrabold mb-6">My Profile</h1>

            <div className="card bg-base-100 border border-base-300 shadow-sm rounded-2xl">
                <div className="card-body p-6 md:p-8">
                    {/* Avatar */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="avatar">
                            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-3">
                                <img src={currentPhoto || user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'U'}&background=f59e0b&color=0f172a&size=128`} alt="avatar" />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold mt-3">{user?.displayName || 'User'}</h2>
                        <p className="text-base-content/50 text-sm">{user?.email}</p>
                        <span className="badge badge-primary badge-outline mt-2 capitalize">{role}</span>
                    </div>

                    <div className="border-b border-base-200 mb-5"></div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-2 block">Display Name</label>
                            <div className="flex items-center gap-3 border border-base-300 rounded-xl px-4 py-3 focus-within:border-primary transition-colors">
                                <FiUser className="text-base-content/30 text-lg shrink-0" />
                                <input type="text" placeholder="Your display name" className="bg-transparent outline-none w-full text-sm placeholder:text-base-content/30" {...register('name')} />
                            </div>
                        </div>

                        <div className="border-b border-base-200"></div>

                        {/* Photo Upload */}
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-2 block">Profile Photo</label>
                            <div className="flex items-center gap-3 border border-base-300 rounded-xl px-4 py-3 focus-within:border-primary transition-colors">
                                <FiImage className="text-base-content/30 text-lg shrink-0" />
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    className="file-input file-input-ghost file-input-sm w-full max-w-xs focus:outline-none" 
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;
                                        setUploading(true);
                                        const formData = new FormData();
                                        formData.append('image', file);
                                        try {
                                            const res = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, formData);
                                            if (res.data.success) {
                                                setValue('photoURL', res.data.data.url);
                                                Swal.fire({ position: 'top-end', icon: 'success', title: 'Image Uploaded', showConfirmButton: false, timer: 1000 });
                                            }
                                        } catch (err) {
                                            Swal.fire({ icon: 'error', title: 'Upload Failed', text: 'Failed to upload image' });
                                        } finally {
                                            setUploading(false);
                                        }
                                    }}
                                />
                            </div>
                            {uploading && <span className="loading loading-spinner loading-xs mt-2 ml-1"></span>}
                            {/* Hidden input to store URL for form submission */}
                            <input type="hidden" {...register('photoURL')} />
                        </div>

                        <div className="border-b border-base-200"></div>

                        {/* Email (read-only) */}
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-2 block">Email Address</label>
                            <div className="flex items-center gap-3 border border-base-300 rounded-xl px-4 py-3 bg-base-200/50">
                                <FiMail className="text-base-content/30 text-lg shrink-0" />
                                <span className="text-sm text-base-content/70">{user?.email || ''}</span>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-full rounded-xl text-base h-12 mt-2">Update Profile</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
