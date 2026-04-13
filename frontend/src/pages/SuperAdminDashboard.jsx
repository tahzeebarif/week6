import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllUsers, updateUserRole } from '../api/userApi';

const SuperAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user: currentUser } = useAuth(); // The logged-in super admin

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      if (userId === currentUser.id) return alert("You cannot change your own role!");
      const data = await updateUserRole(userId, newRole);
      if (data.success) {
        // Update local state smoothly
        setUsers(users.map(u => u._id === userId ? { ...u, role: data.data.role } : u));
      }
    } catch (err) {
      alert("Error updating role");
      console.error(err);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-12 py-12 md:py-20 font-satoshi">
      <h1 className="font-integral font-extrabold text-[28px] md:text-5xl text-black uppercase mb-4 md:mb-8 text-center md:text-left">
        Super Admin Control
      </h1>
      <p className="text-black/60 text-sm md:text-lg mb-8 md:mb-12 max-w-2xl text-center md:text-left mx-auto md:mx-0">
        This panel is for platform-wide management. Here you can promote users to Admins or revoke permissions.
      </p>

      {loading ? (
        <p className="text-center py-20 font-bold">Loading users...</p>
      ) : error ? (
        <p className="text-center py-20 text-red-500 font-bold">{error}</p>
      ) : (
        <div className="border border-black/10 rounded-[20px] bg-white overflow-hidden shadow-sm">
          <div className="bg-[#F0F0F0] px-4 md:px-6 py-4 flex justify-between items-center border-b border-black/5">
            <span className="font-bold uppercase tracking-widest text-xs md:text-sm">Role Management</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="border-b border-black/5 bg-[#F9F9F9]">
                  <th className="px-4 md:px-6 py-4 text-xs font-bold uppercase text-black/60 tracking-wider">User Details</th>
                  <th className="px-4 md:px-6 py-4 text-xs font-bold uppercase text-black/60 tracking-wider">Permissions</th>
                  <th className="px-4 md:px-6 py-4 text-xs font-bold uppercase text-black/60 tracking-wider">Joined</th>
                  <th className="px-4 md:px-6 py-4 text-xs font-bold uppercase text-black/60 tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-black">{u.name}</span>
                        <span className="text-xs text-black/50">{u.email}</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      {u.role === 'super-admin' ? (
                        <span className="bg-red-100 text-red-700 font-bold px-3 py-1 rounded text-[10px] uppercase tracking-wider">SUPER ADMIN</span>
                      ) : u.role === 'admin' ? (
                        <span className="bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded text-[10px] uppercase tracking-wider">ADMIN</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-700 font-bold px-3 py-1 rounded text-[10px] uppercase tracking-wider">USER</span>
                      )}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-xs text-black/60">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-right">
                      {u._id === currentUser.id ? (
                        <span className="text-xs text-black/30 font-bold italic">You</span>
                      ) : u.role === 'super-admin' ? (
                        <span className="text-xs text-black/30 font-bold uppercase">Locked</span>
                      ) : (
                        <div className="flex gap-2 justify-end">
                          {u.role !== 'admin' && (
                            <button 
                              onClick={() => handleRoleChange(u._id, 'admin')}
                              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-3 py-1.5 rounded-full"
                            >
                              Promote
                            </button>
                          )}
                          {u.role === 'admin' && (
                            <button 
                              onClick={() => handleRoleChange(u._id, 'user')}
                              className="text-xs font-bold text-red-600 hover:text-red-800 transition-colors bg-red-50 px-3 py-1.5 rounded-full"
                            >
                              Revoke
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
