import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import { FiType, FiFileText, FiDollarSign, FiHash, FiImage, FiVideo, FiGrid, FiUploadCloud, FiLink, FiX, FiPlus } from 'react-icons/fi';

const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

const AddProduct = () => {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const [imageFiles, setImageFiles] = useState([]);       // { file, preview }
    const [imageUrls, setImageUrls] = useState([]);         // hosted imgbb URLs
    const [urlInput, setUrlInput] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadMode, setUploadMode] = useState('file');   // 'file' | 'url'

    // Upload a single file or URL to imgbb, return hosted URL
    const uploadToImgBB = async (fileOrUrl) => {
        const formData = new FormData();
        if (typeof fileOrUrl === 'string') {
            formData.append('image', fileOrUrl);            // URL string
        } else {
            formData.append('image', fileOrUrl);            // File object
        }
        const { data } = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, formData);
        if (data.success) return data.data.display_url;
        throw new Error('Image upload failed');
    };

    // Handle file selection
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const newFiles = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setImageFiles(prev => [...prev, ...newFiles]);
        e.target.value = '';
    };

    // Handle adding a URL
    const handleAddUrl = async () => {
        const urls = urlInput.split(',').map(u => u.trim()).filter(Boolean);
        if (urls.length === 0) return;
        setUploading(true);
        try {
            const uploaded = await Promise.all(urls.map(url => uploadToImgBB(url)));
            setImageUrls(prev => [...prev, ...uploaded]);
            setUrlInput('');
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Upload Failed', text: err.message });
        } finally {
            setUploading(false);
        }
    };

    // Remove a pending file
    const removeFile = (index) => {
        setImageFiles(prev => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].preview);
            updated.splice(index, 1);
            return updated;
        });
    };

    // Remove an uploaded URL
    const removeUrl = (index) => {
        setImageUrls(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data) => {
        // Validate at least one image
        if (imageFiles.length === 0 && imageUrls.length === 0) {
            Swal.fire({ icon: 'warning', title: 'No Images', text: 'Please add at least one product image.' });
            return;
        }

        try {
            setUploading(true);

            // Upload all pending files to imgbb
            const fileUploadPromises = imageFiles.map(item => uploadToImgBB(item.file));
            const uploadedFileUrls = await Promise.all(fileUploadPromises);

            // Combine: uploaded files + already-uploaded URLs
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
                paymentOption: data.paymentOption,
                showOnHome: false
            };

            await axiosSecure.post('/products', productData);
            Swal.fire({ icon: 'success', title: 'Product Added!', timer: 1500, showConfirmButton: false });
            reset();
            setImageFiles([]);
            setImageUrls([]);
            navigate('/dashboard/manage-products');
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Failed', text: error.response?.data?.message || error.message });
        } finally {
            setUploading(false);
        }
    };

    const allPreviews = [
        ...imageFiles.map((item, i) => ({ type: 'file', src: item.preview, index: i })),
        ...imageUrls.map((url, i) => ({ type: 'url', src: url, index: i }))
    ];

    return (
        <div>
            <h1 className="text-2xl font-extrabold mb-6">Add New Product</h1>

            <div className="card bg-base-100 border border-base-300 shadow-sm max-w-3xl rounded-2xl">
                <div className="card-body p-6 md:p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                        {/* Title */}
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-2 block">Product Title</label>
                            <div className="flex items-center gap-3 border border-base-300 rounded-xl px-4 py-3 focus-within:border-primary transition-colors">
                                <FiType className="text-base-content/30 text-lg shrink-0" />
                                <input type="text" placeholder="e.g. Premium Cotton Shirt" className="bg-transparent outline-none w-full text-sm placeholder:text-base-content/30" {...register('title', { required: 'Required' })} />
                            </div>
                            {errors.title && <span className="text-error text-xs mt-1 block">{errors.title.message}</span>}
                        </div>

                        <div className="border-b border-base-200"></div>

                        {/* Description */}
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-2 block">Description</label>
                            <div className="flex items-start gap-3 border border-base-300 rounded-xl px-4 py-3 focus-within:border-primary transition-colors">
                                <FiFileText className="text-base-content/30 text-lg shrink-0 mt-0.5" />
                                <textarea placeholder="Detailed product description..." className="bg-transparent outline-none w-full text-sm resize-none placeholder:text-base-content/30" rows={3} {...register('description', { required: 'Required' })} />
                            </div>
                            {errors.description && <span className="text-error text-xs mt-1 block">{errors.description.message}</span>}
                        </div>

                        <div className="border-b border-base-200"></div>

                        {/* Category & Payment */}
                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-2 block">Category</label>
                                <div className="flex items-center gap-3 border border-base-300 rounded-xl px-4 py-3 focus-within:border-primary transition-colors">
                                    <FiGrid className="text-base-content/30 text-lg shrink-0" />
                                    <select className="bg-transparent outline-none w-full text-sm cursor-pointer" {...register('category', { required: 'Required' })}>
                                        <option value="">Select Category</option>
                                        <option value="Shirt">Shirt</option>
                                        <option value="Pant">Pant</option>
                                        <option value="Jacket">Jacket</option>
                                        <option value="Accessories">Accessories</option>
                                    </select>
                                </div>
                                {errors.category && <span className="text-error text-xs mt-1 block">{errors.category.message}</span>}
                            </div>
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-2 block">Payment Option</label>
                                <div className="flex items-center gap-6 px-1 py-3">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" value="cod" className="radio radio-primary radio-sm" defaultChecked {...register('paymentOption', { required: 'Required' })} />
                                        <span className="text-sm font-medium">COD</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" value="payfirst" className="radio radio-primary radio-sm" {...register('paymentOption', { required: 'Required' })} />
                                        <span className="text-sm font-medium">PayFirst</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="border-b border-base-200"></div>

                        {/* Price / Qty / MOQ */}
                        <div className="grid md:grid-cols-3 gap-5">
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-2 block">Price ($)</label>
                                <div className="flex items-center gap-3 border border-base-300 rounded-xl px-4 py-3 focus-within:border-primary transition-colors">
                                    <FiDollarSign className="text-base-content/30 text-lg shrink-0" />
                                    <input type="number" step="0.01" placeholder="29.99" className="bg-transparent outline-none w-full text-sm placeholder:text-base-content/30" {...register('price', { required: 'Required', min: { value: 0.01, message: 'Must be > 0' } })} />
                                </div>
                                {errors.price && <span className="text-error text-xs mt-1 block">{errors.price.message}</span>}
                            </div>
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-2 block">Quantity</label>
                                <div className="flex items-center gap-3 border border-base-300 rounded-xl px-4 py-3 focus-within:border-primary transition-colors">
                                    <FiHash className="text-base-content/30 text-lg shrink-0" />
                                    <input type="number" placeholder="100" className="bg-transparent outline-none w-full text-sm placeholder:text-base-content/30" {...register('quantity', { required: 'Required', min: { value: 1, message: 'Min 1' } })} />
                                </div>
                                {errors.quantity && <span className="text-error text-xs mt-1 block">{errors.quantity.message}</span>}
                            </div>
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-2 block">MOQ</label>
                                <div className="flex items-center gap-3 border border-base-300 rounded-xl px-4 py-3 focus-within:border-primary transition-colors">
                                    <FiHash className="text-base-content/30 text-lg shrink-0" />
                                    <input type="number" placeholder="10" className="bg-transparent outline-none w-full text-sm placeholder:text-base-content/30" {...register('moq')} />
                                </div>
                            </div>
                        </div>

                        <div className="border-b border-base-200"></div>

                        {/* ─── Product Images (imgbb) ─── */}
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-2 block">Product Images</label>

                            {/* Mode tabs */}
                            <div className="flex gap-2 mb-3">
                                <button type="button" onClick={() => setUploadMode('file')}
                                    className={`btn btn-sm rounded-lg gap-1.5 ${uploadMode === 'file' ? 'btn-primary' : 'btn-ghost border border-base-300'}`}>
                                    <FiUploadCloud className="text-sm" /> Upload Files
                                </button>
                                <button type="button" onClick={() => setUploadMode('url')}
                                    className={`btn btn-sm rounded-lg gap-1.5 ${uploadMode === 'url' ? 'btn-primary' : 'btn-ghost border border-base-300'}`}>
                                    <FiLink className="text-sm" /> Image URL
                                </button>
                            </div>

                            {/* File upload area */}
                            {uploadMode === 'file' && (
                                <label htmlFor="product-images" className="flex flex-col items-center gap-2 border-2 border-dashed border-base-300 rounded-xl p-6 cursor-pointer hover:border-primary/50 transition-colors group">
                                    <FiUploadCloud className="text-3xl text-base-content/20 group-hover:text-primary transition-colors" />
                                    <span className="text-sm text-base-content/50 group-hover:text-base-content/70">Click to select images</span>
                                    <span className="text-xs text-base-content/30">JPG, PNG, GIF • Max 32 MB each</span>
                                    <input id="product-images" type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />
                                </label>
                            )}

                            {/* URL input area */}
                            {uploadMode === 'url' && (
                                <div className="flex gap-2">
                                    <div className="flex items-center gap-3 border border-base-300 rounded-xl px-4 py-3 focus-within:border-primary transition-colors flex-1">
                                        <FiLink className="text-base-content/30 text-lg shrink-0" />
                                        <input type="text" value={urlInput} onChange={(e) => setUrlInput(e.target.value)}
                                            placeholder="https://example.com/img.jpg  (comma-separate for multiple)"
                                            className="bg-transparent outline-none w-full text-sm placeholder:text-base-content/30"
                                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddUrl(); } }}
                                        />
                                    </div>
                                    <button type="button" onClick={handleAddUrl} disabled={uploading || !urlInput.trim()}
                                        className="btn btn-primary btn-square rounded-xl shrink-0">
                                        {uploading ? <span className="loading loading-spinner loading-xs"></span> : <FiPlus className="text-lg" />}
                                    </button>
                                </div>
                            )}

                            {/* Image previews */}
                            {allPreviews.length > 0 && (
                                <div className="flex flex-wrap gap-3 mt-4">
                                    {allPreviews.map((item, i) => (
                                        <div key={`${item.type}-${item.index}`} className="relative group">
                                            <img src={item.src} alt={`preview-${i}`}
                                                className="w-20 h-20 object-cover rounded-xl border border-base-300 ring-2 ring-transparent group-hover:ring-primary/30 transition-all" />
                                            <button type="button"
                                                onClick={() => item.type === 'file' ? removeFile(item.index) : removeUrl(item.index)}
                                                className="absolute -top-2 -right-2 btn btn-circle btn-xs btn-error shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                                <FiX className="text-xs" />
                                            </button>
                                            {item.type === 'url' && (
                                                <span className="absolute bottom-1 left-1 bg-success text-success-content text-[9px] font-bold px-1.5 py-0.5 rounded-md">✓</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <p className="text-xs text-base-content/40 mt-2">
                                {allPreviews.length === 0 ? 'No images added yet' : `${allPreviews.length} image(s) — files will be uploaded to imgbb on submit`}
                            </p>
                        </div>

                        {/* Demo Video */}
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-2 block">Demo Video URL</label>
                            <div className="flex items-center gap-3 border border-base-300 rounded-xl px-4 py-3 focus-within:border-primary transition-colors">
                                <FiVideo className="text-base-content/30 text-lg shrink-0" />
                                <input type="url" placeholder="https://youtube.com/embed/..." className="bg-transparent outline-none w-full text-sm placeholder:text-base-content/30" {...register('demoVideo')} />
                            </div>
                        </div>

                        <button type="submit" disabled={uploading} className="btn btn-primary w-full rounded-xl text-base h-12 mt-2">
                            {uploading ? <><span className="loading loading-spinner loading-sm"></span> Uploading…</> : 'Add Product'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
