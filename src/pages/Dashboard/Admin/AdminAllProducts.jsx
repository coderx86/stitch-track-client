import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { FiSearch, FiToggleLeft, FiToggleRight, FiTrash2 } from 'react-icons/fi';

const AdminAllProducts = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');

    const { data: products = [], isLoading } = useQuery({
        queryKey: ['admin-products', search],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            return (await axiosSecure.get(`/products/admin/all?${params.toString()}`)).data;
        }
    });

    const toggleMutation = useMutation({
        mutationFn: async ({ id, showOnHome }) => axiosSecure.patch(`/products/${id}/toggle-home`, { showOnHome }),
        onSuccess: () => queryClient.invalidateQueries(['admin-products'])
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => axiosSecure.delete(`/products/admin/${id}`),
        onSuccess: () => queryClient.invalidateQueries(['admin-products'])
    });

    return (
        <div>
            <h1 className="text-2xl font-extrabold mb-6">Master Product List</h1>
            <div className="mb-6 focus-within:ring-2 ring-primary/20 transition-all rounded-lg max-w-md"><label className="input input-bordered input-sm flex items-center gap-2"><FiSearch className="text-base-content/40"/><input type="text" placeholder="Search all products..." className="grow" value={search} onChange={e => setSearch(e.target.value)}/></label></div>
            {isLoading ? <div className="flex justify-center py-10"><span className="loading loading-spinner loading-lg text-primary"></span></div> : (
                <div className="overflow-x-auto bg-base-100 rounded-xl border border-base-300">
                    <table className="table table-zebra w-full">
                        <thead><tr><th>#</th><th>Product</th><th>Category</th><th>Price</th><th>Home</th><th>Action</th></tr></thead>
                        <tbody>
                            {products.map((p, i) => (
                                <tr key={p._id}>
                                    <td>{i + 1}</td>
                                    <td><div className="flex items-center gap-3"><div className="avatar"><div className="w-8 h-8 rounded"><img src={p.images?.[0]} alt=""/></div></div><span className="font-semibold text-sm">{p.title}</span></div></td>
                                    <td><span className="badge badge-outline badge-sm">{p.category}</span></td><td>${p.price}</td>
                                    <td><button className={`btn btn-ghost btn-xs ${p.showOnHome ? 'text-success' : 'text-base-content/20'}`} onClick={() => toggleMutation.mutate({ id: p._id, showOnHome: !p.showOnHome })}>{p.showOnHome ? <FiToggleRight className="text-xl"/> : <FiToggleLeft className="text-xl"/>}</button></td>
                                    <td><button onClick={() => { if(confirm('Delete?')) deleteMutation.mutate(p._id) }} className="btn btn-ghost btn-xs text-error"><FiTrash2/></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminAllProducts;
