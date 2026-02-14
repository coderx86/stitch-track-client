import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { FiSearch, FiShield, FiUserCheck, FiUserX } from 'react-icons/fi';
import { useState } from 'react';
import useAuth from '../../../hooks/useAuth';

const ManageUsers = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery({
        queryKey: ['manage-users', search, roleFilter, statusFilter, page],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (roleFilter) params.append('role', roleFilter);
            if (statusFilter) params.append('status', statusFilter);
            params.append('page', page);
            params.append('limit', 10);
            const res = await axiosSecure.get(`/users?${params.toString()}`);
            return res.data;
        }
    });

    const users = data?.users || [];
    const totalPages = data?.totalPages || 1;

    const roleMutation = useMutation({
        mutationFn: async ({ id, role }) => axiosSecure.patch(`/users/${id}/role`, { role }),
        onSuccess: () => {
            queryClient.invalidateQueries(['manage-users']);
            Swal.fire({ icon: 'success', title: 'Role Updated!', timer: 1500, showConfirmButton: false });
        }
    });

    const statusMutation = useMutation({
        mutationFn: async ({ id, status, suspendReason, suspendFeedback }) => 
            axiosSecure.patch(`/users/${id}/status`, { status, suspendReason, suspendFeedback }),
        onSuccess: () => {
            queryClient.invalidateQueries(['manage-users']);
            Swal.fire({ icon: 'success', title: 'Status Updated!', timer: 1500, showConfirmButton: false });
        }
    });

    const handleRoleChange = (userId, newRole) => {
        Swal.fire({
            title: 'Change Role?',
            text: `Set role to "${newRole}"?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, change it!'
        }).then((result) => {
            if (result.isConfirmed) roleMutation.mutate({ id: userId, role: newRole });
        });
    };

    const handleSuspend = async (userId) => {
        const { value: formValues } = await Swal.fire({
            title: 'Suspend User',
            html: '<input id="swal-reason" class="swal2-input" placeholder="Reason for suspension">' +
                 '<textarea id="swal-feedback" class="swal2-textarea" placeholder="Additional feedback"></textarea>',
            showCancelButton: true,
            preConfirm: () => ({
                suspendReason: document.getElementById('swal-reason').value,
                suspendFeedback: document.getElementById('swal-feedback').value
            })
        });
        if (formValues) statusMutation.mutate({ id: userId, status: 'suspended', ...formValues });
    };

    const handleActivate = (userId) => {
        statusMutation.mutate({ id: userId, status: 'approved' });
    };

    const roleBadge = (role) => {
        const colors = { admin: 'badge-error', manager: 'badge-info', buyer: 'badge-success' };
        return <span className={`badge badge-sm ${colors[role] || 'badge-ghost'} capitalize`}>{role}</span>;
    };

    return (
        <div>
            <h1 className="text-2xl font-extrabold mb-6">Manage Users</h1>
            <div className="flex flex-wrap gap-3 mb-6">
                <label className="input input-bordered input-sm flex items-center gap-2 flex-1 min-w-[200px]">
                    <FiSearch /><input type="text" placeholder="Search..." className="grow" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
                </label>
                <select className="select select-bordered select-sm" value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}>
                    <option value="">All Roles</option>
                    <option value="buyer">Buyer</option><option value="manager">Manager</option><option value="admin">Admin</option>
                </select>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-10"><span className="loading loading-spinner loading-lg text-primary"></span></div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <thead><tr><th>#</th><th>User</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
                        <tbody>
                            {users.map((u, i) => (
                                <tr key={u._id}>
                                    <td>{(page - 1) * 10 + i + 1}</td>
                                    <td>{u.name}</td><td>{u.email}</td><td>{roleBadge(u.role)}</td>
                                    <td>
                                        <div className="flex gap-1">
                                            {u.email !== user?.email && (
                                                <>
                                                    <div className="dropdown dropdown-end">
                                                        <div tabIndex={0} role="button" className="btn btn-ghost btn-xs"><FiShield /></div>
                                                        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32 border border-base-300 z-10">
                                                            <li><button onClick={() => handleRoleChange(u._id, 'buyer')}>Buyer</button></li>
                                                            <li><button onClick={() => handleRoleChange(u._id, 'manager')}>Manager</button></li>
                                                            <li><button onClick={() => handleRoleChange(u._id, 'admin')}>Admin</button></li>
                                                        </ul>
                                                    </div>
                                                    {u.status === 'suspended' ? (
                                                        <button className="btn btn-ghost btn-xs text-success" onClick={() => handleActivate(u._id)}><FiUserCheck /></button>
                                                    ) : (
                                                        <button className="btn btn-ghost btn-xs text-error" onClick={() => handleSuspend(u._id)}><FiUserX /></button>
                                                    )}
                                                </>
                                            )}
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

export default ManageUsers;
