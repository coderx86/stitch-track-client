import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { FiSearch, FiToggleLeft, FiToggleRight, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const AdminAllProducts = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data = {}, isLoading } = useQuery({
        queryKey: ['admin-products', search, page],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            
            // Note: Implementing frontend pagination since backend handles all products returning
            const res = await axiosSecure.get(`/products/admin/all?${params.toString()}`);
            const allData = res.data;
            
            // Frontend pagination logic
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedData = allData.slice(startIndex, endIndex);
            
            return {
                products: paginatedData,
                total: allData.length,
                totalPages: Math.ceil(allData.length / limit)
            };
        }
    });

    const { products = [], totalPages = 1 } = data;

    const toggleMutation = useMutation({
        mutationFn: async ({ id, showOnHome }) => axiosSecure.patch(`/products/${id}/toggle-home`, { showOnHome }),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-products']);
            Swal.fire({ icon: 'success', title: 'Updated!', timer: 1000, showConfirmButton: false });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => axiosSecure.delete(`/products/admin/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-products']);
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
            <h1 className="text-2xl font-extrabold mb-6">All Products</h1>

            <div className="mb-6">
                <label className="input input-bordered input-sm flex items-center gap-2 max-w-md">
                    <FiSearch />
                    <input type="text" placeholder="Search products..." className="grow" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
                </label>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-10"><span className="loading loading-spinner loading-lg text-primary"></span></div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Qty</th>
                                <th>Home</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p, i) => (
                                <tr key={p._id}>
                                    <td>{(page - 1) * limit + i + 1}</td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar"><div className="w-10 rounded"><img src={p.images?.[0] || 'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp'} alt="" /></div></div>
                                            <span className="font-medium text-sm">{p.title}</span>
                                        </div>
                                    </td>
                                    <td><span className="badge badge-outline badge-sm">{p.category}</span></td>
                                    <td className="font-semibold">${p.price}</td>
                                    <td>{p.quantity}</td>
                                    <td>
                                        <button
                                            className={`btn btn-ghost btn-xs ${p.showOnHome ? 'text-success' : 'text-base-content/40'}`}
                                            onClick={() => toggleMutation.mutate({ id: p._id, showOnHome: !p.showOnHome })}
                                        >
                                            {p.showOnHome ? <FiToggleRight className="text-2xl" /> : <FiToggleLeft className="text-2xl" />}
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn btn-ghost btn-xs text-error" onClick={() => handleDelete(p._id)}><FiTrash2 className="text-lg" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-6 py-4">
                            <div className="join shadow-sm">
                                <button 
                                    className="join-item btn btn-sm" 
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    <FiChevronLeft />
                                </button>
                                {[...Array(totalPages)].map((_, idx) => (
                                    <button 
                                        key={idx}
                                        className={`join-item btn btn-sm ${page === idx + 1 ? 'btn-primary' : ''}`}
                                        onClick={() => setPage(idx + 1)}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}
                                <button 
                                    className="join-item btn btn-sm" 
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                >
                                    <FiChevronRight />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminAllProducts;
