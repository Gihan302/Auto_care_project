'use client';

import React, { useState, useEffect } from 'react';
import { Search, Eye, Edit2, Trash2, UserCheck, UserX, Building, CheckCircle, XCircle, Clock } from 'lucide-react';
import styles from './page.module.css';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  const API_BASE_URL = 'http://localhost:8080/api/admin';

  const getAuthToken = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.token || user.accessToken;
      } catch (e) {
        return localStorage.getItem('token');
      }
    }
    return localStorage.getItem('token');
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/all`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/stats`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleViewUser = async (user) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setSelectedUser(userData);
        setIsViewDialogOpen(true);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      alert('Failed to load user details');
    }
  };

  const handleEditUser = async (user) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setSelectedUser(userData);
        setIsEditDialogOpen(true);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      alert('Failed to load user details');
    }
  };

  const handleSaveUser = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fname: selectedUser.fname,
          lname: selectedUser.lname,
          companyName: selectedUser.companyName,
          telephone: selectedUser.telephone,
          address: selectedUser.address
        })
      });

      if (response.ok) {
        alert('User updated successfully!');
        setIsEditDialogOpen(false);
        fetchUsers();
        fetchStats();
      } else {
        alert('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user');
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        alert('Status updated successfully!');
        fetchUsers();
        fetchStats();
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('User deleted successfully!');
        fetchUsers();
        fetchStats();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  useEffect(() => {
    let filtered = [...users];

    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.fname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.cName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.nic?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(user => 
        user.accountStatus?.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    if (filterRole !== 'all') {
      filtered = filtered.filter(user =>
        user.roles?.some(role => role.toLowerCase().includes(filterRole.toLowerCase()))
      );
    }

    setFilteredUsers(filtered);
  }, [searchQuery, filterStatus, filterRole, users]);

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const getStatusBadge = (status) => {
    const config = {
      PENDING: { icon: Clock, className: styles.statusPending, text: 'Pending' },
      APPROVED: { icon: CheckCircle, className: styles.statusApproved, text: 'Approved' },
      REJECTED: { icon: XCircle, className: styles.statusRejected, text: 'Rejected' }
    };

    const statusInfo = config[status] || config.PENDING;
    const Icon = statusInfo.icon;

    return (
      <span className={`${styles.badge} ${statusInfo.className}`}>
        <Icon size={12} />
        {statusInfo.text}
      </span>
    );
  };

  const getRoleBadge = (roles) => {
    if (!roles || roles.length === 0) return null;
    
    const roleText = roles[0].replace('ROLE_', '');
    const roleClasses = {
      ICOMPANY: styles.roleICompany,
      LCOMPANY: styles.roleLCompany,
      USER: styles.roleUser,
      ADMIN: styles.roleAdmin
    };

    return (
      <span className={`${styles.badge} ${roleClasses[roleText] || styles.roleUser}`}>
        {roleText}
      </span>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>User Management</h1>
            <p className={styles.subtitle}>Manage and monitor all system users</p>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Building size={24} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{stats.total}</div>
              <div className={styles.statLabel}>Total Users</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{background: 'linear-gradient(135deg, #fef3c7, #fde68a)'}}>
              <Clock size={24} style={{color: '#f59e0b'}} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{stats.pending}</div>
              <div className={styles.statLabel}>Pending</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)'}}>
              <CheckCircle size={24} style={{color: '#10b981'}} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{stats.approved}</div>
              <div className={styles.statLabel}>Approved</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{background: 'linear-gradient(135deg, #fee2e2, #fecaca)'}}>
              <XCircle size={24} style={{color: '#ef4444'}} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{stats.rejected}</div>
              <div className={styles.statLabel}>Rejected</div>
            </div>
          </div>
        </div>

        <div className={styles.searchCard}>
          <div className={styles.searchContent}>
            <div className={styles.searchContainer}>
              <Search className={styles.searchIcon} size={20} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.filters}>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="icompany">Insurance</option>
                <option value="lcompany">Leasing</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.tableCard}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p className={styles.loadingText}>Loading users...</p>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Contact</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Registered</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className={styles.userInfo}>
                          <div className={styles.userAvatar}>
                            {user.fname?.charAt(0) || 'U'}
                          </div>
                          <div className={styles.userDetails}>
                            <div className={styles.userName}>
                              {user.fname} {user.lname}
                            </div>
                            <div className={styles.userCompany}>{user.cName || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={styles.contactInfo}>
                          <div className={styles.contactEmail}>{user.username}</div>
                          <div className={styles.contactPhone}>{user.tnumber || 'N/A'}</div>
                        </div>
                      </td>
                      <td>{getRoleBadge(user.roles)}</td>
                      <td>{getStatusBadge(user.accountStatus)}</td>
                      <td className={styles.joinedDate}>
                        {user.date ? new Date(user.date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            onClick={() => handleViewUser(user)}
                            className={`${styles.actionButton} ${styles.viewButton}`}
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEditUser(user)}
                            className={`${styles.actionButton} ${styles.editButton}`}
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          
                          {user.accountStatus === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(user.id, 'APPROVED')}
                                className={styles.approveButton}
                                title="Approve"
                              >
                                <UserCheck size={16} />
                              </button>
                              <button
                                onClick={() => handleStatusChange(user.id, 'REJECTED')}
                                className={styles.deleteButton}
                                title="Reject"
                              >
                                <UserX size={16} />
                              </button>
                            </>
                          )}
                          
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className={styles.deleteButton}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className={styles.emptyState}>
                  <p className={styles.emptyTitle}>No users found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isViewDialogOpen && selectedUser && (
        <div className={styles.dialogOverlay} onClick={() => setIsViewDialogOpen(false)}>
          <div className={styles.dialogContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.dialogHeader}>
              <h2 className={styles.dialogTitle}>User Details</h2>
              <button
                onClick={() => setIsViewDialogOpen(false)}
                className={styles.dialogClose}
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className={styles.dialogBody}>
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <label className={styles.detailLabel}>First Name</label>
                  <p className={styles.detailValue}>{selectedUser.fname}</p>
                </div>
                <div className={styles.detailItem}>
                  <label className={styles.detailLabel}>Last Name</label>
                  <p className={styles.detailValue}>{selectedUser.lname}</p>
                </div>
                <div className={styles.detailItem}>
                  <label className={styles.detailLabel}>Email</label>
                  <p className={styles.detailValue}>{selectedUser.email}</p>
                </div>
                <div className={styles.detailItem}>
                  <label className={styles.detailLabel}>Phone</label>
                  <p className={styles.detailValue}>{selectedUser.telephone || 'N/A'}</p>
                </div>
                <div className={styles.detailItem}>
                  <label className={styles.detailLabel}>NIC</label>
                  <p className={styles.detailValue}>{selectedUser.nic || 'N/A'}</p>
                </div>
                <div className={styles.detailItem}>
                  <label className={styles.detailLabel}>Company</label>
                  <p className={styles.detailValue}>{selectedUser.companyName || 'N/A'}</p>
                </div>
                <div className={styles.detailItem}>
                  <label className={styles.detailLabel}>Reg Number</label>
                  <p className={styles.detailValue}>{selectedUser.regNum || 'N/A'}</p>
                </div>
                <div className={styles.detailItem}>
                  <label className={styles.detailLabel}>Status</label>
                  <div>{getStatusBadge(selectedUser.accountStatus)}</div>
                </div>
                <div className={`${styles.detailItem} ${styles.detailItemFull}`}>
                  <label className={styles.detailLabel}>Address</label>
                  <p className={styles.detailValue}>{selectedUser.address || 'N/A'}</p>
                </div>
                <div className={styles.detailItem}>
                  <label className={styles.detailLabel}>Registered</label>
                  <p className={styles.detailValue}>
                    {selectedUser.registerDate ? new Date(selectedUser.registerDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className={styles.detailItem}>
                  <label className={styles.detailLabel}>Roles</label>
                  <div className={styles.rolesContainer}>
                    {selectedUser.roles?.map((role, idx) => (
                      <span key={idx} className={styles.badge}>
                        {role.replace('ROLE_', '')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.dialogFooter}>
              <button
                onClick={() => setIsViewDialogOpen(false)}
                className={styles.btnSecondary}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditDialogOpen && selectedUser && (
        <div className={styles.dialogOverlay} onClick={() => setIsEditDialogOpen(false)}>
          <div className={styles.dialogContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.dialogHeader}>
              <h2 className={styles.dialogTitle}>Edit User</h2>
              <button
                onClick={() => setIsEditDialogOpen(false)}
                className={styles.dialogClose}
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className={styles.dialogBody}>
              <div className={styles.detailsGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>First Name</label>
                  <input
                    type="text"
                    value={selectedUser.fname || ''}
                    onChange={(e) => setSelectedUser({...selectedUser, fname: e.target.value})}
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Last Name</label>
                  <input
                    type="text"
                    value={selectedUser.lname || ''}
                    onChange={(e) => setSelectedUser({...selectedUser, lname: e.target.value})}
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Company Name</label>
                  <input
                    type="text"
                    value={selectedUser.companyName || ''}
                    onChange={(e) => setSelectedUser({...selectedUser, companyName: e.target.value})}
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Phone</label>
                  <input
                    type="text"
                    value={selectedUser.telephone || ''}
                    onChange={(e) => setSelectedUser({...selectedUser, telephone: e.target.value})}
                    className={styles.formInput}
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.detailItemFull}`}>
                  <label className={styles.formLabel}>Address</label>
                  <textarea
                    value={selectedUser.address || ''}
                    onChange={(e) => setSelectedUser({...selectedUser, address: e.target.value})}
                    className={`${styles.formInput} ${styles.formTextarea}`}
                  />
                </div>
              </div>
            </div>

            <div className={styles.dialogFooter}>
              <button
                onClick={() => setIsEditDialogOpen(false)}
                className={styles.btnSecondary}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUser}
                className={styles.btnPrimary}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;