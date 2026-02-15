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
        defaultValues: { name: user?.displayName || '', photoURL: user?.photoURL || '' }
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
            <h1 className="text-2xl font-extrabold mb-8">My Profile</h1>
            <div className="card bg-base-100 border border-base-300 shadow-sm rounded-2xl overflow-hidden">
                <div className="p-8 md:p-10">
                    <div className="flex flex-col items-center mb-10">
                        <div className="avatar"><div className="w-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4"><img src={currentPhoto || user?.photoURL} alt="avatar" /></div></div>
                        <h2 className="text-2xl font-bold mt-5 text-base-content">{user?.displayName || 'User'}</h2>
                        <span className="badge badge-primary badge-outline mt-2 px-4 py-3 capitalize font-semibold">{role}</span>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-1.5"><label className="text-xs font-bold uppercase tracking-widest text-base-content/40 ml-1">Full Name</label><div className="flex items-center gap-3 border border-base-300 rounded-2xl px-5 py-4 focus-within:border-primary focus-within:ring-2 ring-primary/10 transition-all"><FiUser className="text-base-content/30 text-xl"/><input type="text" className="bg-transparent outline-none w-full text-base" {...register('name')} /></div></div>
                        <div className="space-y-1.5"><label className="text-xs font-bold uppercase tracking-widest text-base-content/40 ml-1">Profile Photo</label><div className="flex items-center gap-3 border border-base-300 rounded-2xl px-5 py-4 bg-base-50 focus-within:bg-white focus-within:border-primary transition-all"><FiImage className="text-base-content/30 text-xl"/><input type="file" className="file-input file-input-ghost file-input-sm w-full focus:outline-none" onChange={async (e) => {
                            const file = e.target.files[0]; if (!file) return; setUploading(true); const formData = new FormData(); formData.append('image', file);
                            try { const res = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, formData); if (res.data.success) { setValue('photoURL', res.data.data.url); Swal.fire({ icon: 'success', title: 'Image Uploaded', timer: 1000, showConfirmButton: false }); }} 
                            catch (err) { Swal.fire({ icon: 'error', title: 'Upload Failed' }); } finally { setUploading(false); }
                        }}/></div>{uploading && <div className="loading loading-spinner loading-xs mt-2 ml-1"></div>}</div>
                        <div className="space-y-1.5 opacity-60 pointer-events-none"><label className="text-xs font-bold uppercase tracking-widest text-base-content/40 ml-1">Email (Locked)</label><div className="flex items-center gap-3 border border-base-300 rounded-2xl px-5 py-4 bg-base-200"><FiMail className="text-base-content/30 text-xl"/><span>{user?.email}</span></div></div>
                        <button type="submit" className="btn btn-primary w-full rounded-2xl h-14 text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all mt-4">Save Changes</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
