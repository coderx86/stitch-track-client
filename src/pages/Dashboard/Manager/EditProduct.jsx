import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FiType, FiFileText, FiDollarSign, FiHash, FiVideo, FiGrid, FiUploadCloud, FiX } from 'react-icons/fi';

const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

const EditProduct = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const [imageFiles, setImageFiles] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axiosSecure.get(`/products/${id}`);
                reset({
                    title: data.title,
                    description: data.description,
                    category: data.category,
                    price: data.price,
                    quantity: data.quantity,
                    moq: data.moq,
                    paymentOption: data.paymentOption,
                    demoVideo: data.demoVideo || ''
                });
                if (data.images && data.images.length > 0) setImageUrls(data.images);
            } catch (error) {
                Swal.fire({ icon: 'error', title: 'Failed to load product', text: error.message });
                navigate('/dashboard/manage-products');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const uploadToImgBB = async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        const { data } = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, formData);
        if (data.success) return data.data.display_url;
        throw new Error('Image upload failed');
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const newFiles = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setImageFiles(prev => [...prev, ...newFiles]);
        e.target.value = '';
    };

    const removeFile = (index) => {
        setImageFiles(prev => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].preview);
            updated.splice(index, 1);
            return updated;
        });
    };

    const removeUrl = (index) => {
        setImageUrls(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data) => {
        if (imageFiles.length === 0 && imageUrls.length === 0) {
            Swal.fire({ icon: 'warning', title: 'No Images', text: 'Please add at least one product image.' });
            return;
        }

        try {
            setUploading(true);
            const uploadedFileUrls = await Promise.all(imageFiles.map(item => uploadToImgBB(item.file)));
            const allImages = [...uploadedFileUrls, ...imageUrls];

            const productData = {
                title: data.title,
                description: data.description,
                category: data.category,
                price: parseFloat(data.price),
                quantity: parseInt(data.quantity),
                moq: parseInt(data.moq) || 1,
                images: allImages,
                demoVideo: data.demoVideo || '',
                paymentOption: data.paymentOption
            };

            await axiosSecure.put(`/products/${id}`, productData);
            Swal.fire({ icon: 'success', title: 'Product Updated!', timer: 1500, showConfirmButton: false });
            navigate('/dashboard/manage-products');
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Failed', text: error.response?.data?.message || error.message });
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

    return (
        <div>
            <h1 className="text-2xl font-extrabold mb-6">Edit Product</h1>
            <div className="card bg-base-100 border border-base-300 shadow-sm max-w-3xl rounded-2xl p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wider mb-2 block">Product Title</label>
                        <div className="flex items-center gap-3 border border-base-300 rounded-xl px-4 py-3">
                            <FiType /><input type="text" className="bg-transparent outline-none w-full" {...register('title', { required: true })} />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wider mb-2 block">Description</label>
                        <div className="flex items-start gap-3 border border-base-300 rounded-xl px-4 py-3">
                            <FiFileText className="mt-1" /><textarea className="bg-transparent outline-none w-full" rows={3} {...register('description', { required: true })} />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                        <select className="select select-bordered" {...register('category', { required: true })}>
                            <option value="">Select Category</option>
                            <option value="Shirt">Shirt</option><option value="Pant">Pant</option><option value="Jacket">Jacket</option><option value="Accessories">Accessories</option>
                        </select>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2"><input type="radio" value="cod" className="radio radio-primary" {...register('paymentOption')} /><span>COD</span></label>
                            <label className="flex items-center gap-2"><input type="radio" value="payfirst" className="radio radio-primary" {...register('paymentOption')} /><span>PayFirst</span></label>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-5">
                        <input type="number" step="0.01" className="input input-bordered" {...register('price', { required: true })} />
                        <input type="number" className="input input-bordered" {...register('quantity', { required: true })} />
                        <input type="number" className="input input-bordered" {...register('moq')} />
                    </div>
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wider mb-2 block">Product Images</label>
                        <label className="flex flex-col items-center gap-2 border-2 border-dashed border-base-300 rounded-xl p-6 cursor-pointer hover:border-primary/50 transition-colors">
                            <FiUploadCloud className="text-3xl text-base-content/20" />
                            <span className="text-sm text-base-content/50">Click to select new images</span>
                            <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />
                        </label>
                        <div className="flex flex-wrap gap-3 mt-4">
                            {imageUrls.map((url, i) => (
                                <div key={`url-${i}`} className="relative group">
                                    <img src={url} className="w-20 h-20 object-cover rounded-xl border border-base-300" alt="" />
                                    <button type="button" onClick={() => removeUrl(i)} className="absolute -top-2 -right-2 btn btn-circle btn-xs btn-error shadow-md"><FiX /></button>
                                </div>
                            ))}
                            {imageFiles.map((item, i) => (
                                <div key={`file-${i}`} className="relative group">
                                    <img src={item.preview} className="w-20 h-20 object-cover rounded-xl border border-base-300" alt="" />
                                    <button type="button" onClick={() => removeFile(i)} className="absolute -top-2 -right-2 btn btn-circle btn-xs btn-error shadow-md"><FiX /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button type="submit" disabled={uploading} className="btn btn-primary w-full">
                        {uploading ? 'Updating...' : 'Update Product'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
