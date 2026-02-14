import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router';

const ManageProducts = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const { data: products = [], isLoading } = useQuery({
        queryKey: ['my-products'],
        queryFn: async () => (await axiosSecure.get('/products/manager/my-products')).data
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => axiosSecure.delete(`/products/manager/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['my-products']);
            Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1000, showConfirmButton: false });
        }
    });

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Delete Product?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Delete'
        }).then((result) => {
            if (result.isConfirmed) deleteMutation.mutate(id);
        });
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-extrabold">My Products</h1>
                <Link to="/dashboard/add-product" className="btn btn-primary btn-sm">+ Add Product</Link>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-10"><span className="loading loading-spinner loading-lg text-primary"></span></div>
            ) : products.length === 0 ? (
                <div className="text-center py-20 text-base-content/50">
                    <p className="text-lg">You haven't added any products yet.</p>
                    <Link to="/dashboard/add-product" className="btn btn-primary btn-sm mt-4">Add Your First Product</Link>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr><th>#</th><th>Product</th><th>Category</th><th>Price</th><th>Qty</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {products.map((p, i) => (
                                <tr key={p._id}>
                                    <td>{i + 1}</td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="w-10 rounded">
                                                    <img src={p.images?.[0] || 'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp'} alt="" />
                                                </div>
                                            </div>
                                            <span className="font-medium text-sm">{p.title}</span>
                                        </div>
                                    </td>
                                    <td><span className="badge badge-outline badge-sm">{p.category}</span></td>
                                    <td>${p.price}</td>
                                    <td>{p.quantity}</td>
                                    <td>
                                        <div className="flex gap-1">
                                            <Link to={`/dashboard/edit-product/${p._id}`} className="btn btn-ghost btn-xs text-info"><FiEdit2 /></Link>
                                            <button className="btn btn-ghost btn-xs text-error" onClick={() => handleDelete(p._id)}><FiTrash2 /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageProducts;
