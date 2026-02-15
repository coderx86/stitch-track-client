import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { FiSearch, FiEdit2, FiShield, FiUserCheck, FiUserX } from 'react-icons/fi';
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
        mutationFn: async ({ id, role }) => {
            return axiosSecure.patch(`/users/${id}/role`, { role });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['manage-users']);
            Swal.fire({ icon: 'success', title: 'Role Updated!', timer: 1500, showConfirmButton: false });
        }
    });

    const statusMutation = useMutation({
        mutationFn: async ({ id, status, suspendReason, suspendFeedback }) => {
            return axiosSecure.patch(`/users/${id}/status`, { status, suspendReason, suspendFeedback });
        },
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
            if (result.isConfirmed) {
                roleMutation.mutate({ id: userId, role: newRole });
            }
        });
    };

    const handleSuspend = async (userId) => {
        const { value: formValues } = await Swal.fire({
            title: 'Suspend User',
            html:
                '<input id="swal-reason" class="swal2-input" placeholder="Reason for suspension">' +
                '<textarea id="swal-feedback" class="swal2-textarea" placeholder="Additional feedback"></textarea>',
            showCancelButton: true,
            preConfirm: () => ({
                suspendReason: document.getElementById('swal-reason').value,
                suspendFeedback: document.getElementById('swal-feedback').value
            })
        });

        if (formValues) {
            statusMutation.mutate({ id: userId, status: 'suspended', ...formValues });
        }
    };

    const handleActivate = (userId) => {
        Swal.fire({
            title: 'Activate User?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, activate!'
        }).then((result) => {
            if (result.isConfirmed) {
                statusMutation.mutate({ id: userId, status: 'approved' });
            }
        });
    };

    const roleBadge = (role) => {
        const colors = { admin: 'badge-error', manager: 'badge-info', buyer: 'badge-success' };
        return <span className={`badge badge-sm ${colors[role] || 'badge-ghost'} capitalize`}>{role}</span>;
    };

    const statusBadge = (status) => {
        const colors = { active: 'badge-success', pending: 'badge-warning', suspended: 'badge-error' };
        return <span className={`badge badge-sm ${colors[status] || 'badge-ghost'} capitalize`}>{status}</span>;
    };

    return (
        <div>
            <h1 className="text-2xl font-extrabold mb-6">Manage Users</h1>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
                <label className="input input-bordered input-sm flex items-center gap-2 flex-1 min-w-[200px]">
                    <FiSearch />
                    <input type="text" placeholder="Search name or email..." className="grow" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
                </label>
                <select className="select select-bordered select-sm" value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}>
                    <option value="">All Roles</option>
                    <option value="buyer">Buyer</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                </select>
                <select className="select select-bordered select-sm" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                </select>
            </div>

            {/* Table */}
            {isLoading ? (
                <div className="flex justify-center py-10"><span className="loading loading-spinner loading-lg text-primary"></span></div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                {/* <th>Status</th> */}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u, i) => (
                                <tr key={u._id}>
                                    <td>{(page - 1) * 10 + i + 1}</td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar"><div className="w-8 rounded-full"><img src={u.photoURL || `https://ui-avatars.com/api/?name=${u.name || 'U'}`} alt="" /></div></div>
                                            <span className="font-medium text-sm">{u.name || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td className="text-sm">{u.email}</td>
                                    <td>{roleBadge(u.role)}</td>
                                    {/* <td>{statusBadge(u.status)}</td> */}
                                    <td>
                                        <div className="flex gap-1">
                                            {u.email === user?.email ? (
                                                <span className="text-xs text-base-content/40 italic">You</span>
                                            ) : (
                                                <>
                                                    <div className="dropdown dropdown-end">
                                                <div tabIndex={0} role="button" className="btn btn-ghost btn-xs tooltip" data-tip="Change Role">
                                                    <FiShield />
                                                </div>
                                                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32 border border-base-300">
                                                    <li><button onClick={() => handleRoleChange(u._id, 'buyer')}>Buyer</button></li>
                                                    <li><button onClick={() => handleRoleChange(u._id, 'manager')}>Manager</button></li>
                                                    <li><button onClick={() => handleRoleChange(u._id, 'admin')}>Admin</button></li>
                                                </ul>
                                            </div>
                                            {u.role === 'manager' && u.status === 'pending' && (
                                                 <button className="btn btn-ghost btn-xs text-primary tooltip" data-tip="Approve Manager" onClick={() => handleActivate(u._id)}><FiUserCheck /></button>
                                            )}
                                            {u.status === 'suspended' ? (
                                                <button className="btn btn-ghost btn-xs text-success tooltip" data-tip="Activate" onClick={() => handleActivate(u._id)}><FiUserCheck /></button>
                                            ) : (
                                                <button className="btn btn-ghost btn-xs text-error tooltip" data-tip="Suspend" onClick={() => handleSuspend(u._id)}><FiUserX /></button>
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

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                    <div className="join">
                        {[...Array(totalPages)].map((_, i) => (
                            <button key={i} className={`join-item btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-outline'}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
