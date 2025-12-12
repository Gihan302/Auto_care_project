'use client';

import React, { useState, useEffect } from 'react';
import { Search, Eye, Edit2, Trash2, UserCheck, UserX, Building, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
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
  const [notification, setNotification] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  // ✅ FIXED: Use the correct base URL
  const API_BASE_URL = 'http://localhost:8080/api/admin';

  // ✅ FIXED: Better token retrieval
  const getAuthToken = () => {
    // Try user object first
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        if (userData && userData.token) {
          return userData.token;
        }
        if (userData && userData.accessToken) {
          return userData.accessToken;
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    
    // Try direct token
    return localStorage.getItem('token') || localStorage.getItem('userToken') || '';
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // ✅ FIXED: Added proper error handling and field mapping
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      
      if (!token) {
        showNotification('No authentication token found. Please login again.', 'error');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/users/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // ✅ Map backend fields to frontend expectations
        // ✅ FIXED: Better field mapping with fallbacks
const mappedUsers = data.map(user => ({
  id: user.id,
  fname: user.fname || '',
  lname: user.lname || '',
  username: user.username, // Backend uses 'username' for email
  email: user.username,    // Add email field
  cName: user.cName || user.companyName || '',
  companyName: user.cName || user.companyName || '', // Map both ways
  nic: user.nic || '',
  tnumber: user.tnumber || user.telephone || '',
  telephone: user.tnumber || user.telephone || '', // Map both ways
  address: user.address || '',
  date: user.date || user.registerDate,
  registerDate: user.date || user.registerDate, // Map both ways
  accountStatus: user.accountStatus,
  roles: user.roles || [],
  regNum: user.regNum || '',
  approvedBy: user.approvedBy,
  approvedAt: user.approvedAt,
  rejectionReason: user.rejectionReason
}));
        
        setUsers(mappedUsers);
        setFilteredUsers(mappedUsers);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch users:', response.status, errorText);
        showNotification(`Failed to fetch users: ${response.status}`, 'error');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showNotification('Network error. Please check your connection.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/users/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
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
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        // ✅ Map fields correctly
        const mappedUser = {
          ...userData,
          email: userData.email || userData.username,
          companyName: userData.companyName || userData.cName,
          telephone: userData.telephone || userData.tnumber,
          registerDate: userData.registerDate || userData.date
        };
        setSelectedUser(mappedUser);
        setIsViewDialogOpen(true);
      } else {
        showNotification('Failed to load user details', 'error');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      showNotification('Failed to load user details', 'error');
    }
  };

  const handleEditUser = async (user) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        const mappedUser = {
          ...userData,
          email: userData.email || userData.username,
          companyName: userData.companyName || userData.cName,
          telephone: userData.telephone || userData.tnumber,
          registerDate: userData.registerDate || userData.date
        };
        setSelectedUser(mappedUser);
        setIsEditDialogOpen(true);
      } else {
        showNotification('Failed to load user details', 'error');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      showNotification('Failed to load user details', 'error');
    }
  };

// ✅ FIXED: Send correct field names that match backend expectations
const handleSaveUser = async () => {
  try {
    const token = getAuthToken();
    
    // Prepare data in backend expected format
    const updateData = {
      fname: selectedUser.fname,
      lname: selectedUser.lname,
      companyName: selectedUser.companyName || selectedUser.cName,
      telephone: selectedUser.telephone || selectedUser.tnumber,
      address: selectedUser.address
    };

    console.log('Sending update data:', updateData); // Debug log

    const response = await fetch(`${API_BASE_URL}/users/${selectedUser.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    if (response.ok) {
      const result = await response.json();
      showNotification(result.message || 'User updated successfully!', 'success');
      setIsEditDialogOpen(false);
      fetchUsers(); // Refresh the list
      fetchStats(); // Refresh stats
    } else {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error('Update failed:', errorData);
      showNotification(errorData.message || 'Failed to update user', 'error');
    }
  } catch (error) {
    console.error('Error updating user:', error);
    showNotification('Error updating user: ' + error.message, 'error');
  }
};

const handleStatusChange = async (userId, newStatus) => {
  const confirmMessage = newStatus === 'APPROVED' 
    ? 'Are you sure you want to approve this user? An approval email will be sent.'
    : 'Are you sure you want to reject this user? A rejection email will be sent.';
  
  if (!window.confirm(confirmMessage)) {
    return;
  }

  try {
    const token = getAuthToken();
    
    // Get current admin user from localStorage
    const getCurrentAdmin = () => {
      try {
        const userString = localStorage.getItem('user');
        if (userString) {
          return JSON.parse(userString);
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
      return null;
    };

    const currentUser = getCurrentAdmin();
    const adminId = currentUser?.id || currentUser?.userId || "1";

    console.log('Current admin:', currentUser); // Debug log
    console.log('Admin ID to be sent:', adminId); // Debug log

    // Prepare request body
    const requestBody = { 
      status: newStatus,
      adminId: adminId
    };
    
    // Add reason for rejection
    if (newStatus === 'REJECTED') {
      requestBody.reason = 'Registration does not meet requirements';
    }

    console.log('Sending status update request:', {
      url: `${API_BASE_URL}/users/${userId}/status`,
      method: 'PUT',
      body: requestBody
    });

    const response = await fetch(`${API_BASE_URL}/users/${userId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server responded with error:', response.status, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('Status update successful:', result);
    
    // Handle email notification status
    if (result.emailSent === false) {
      showNotification(
        `User ${newStatus.toLowerCase()}! Status updated but email notification failed.`, 
        'warning'
      );
    } else {
      showNotification(
        result.message || `User ${newStatus.toLowerCase()} successfully!`, 
        'success'
      );
    }
    
    // Refresh data
    fetchUsers();
    fetchStats();
    
  } catch (error) {
    console.error('Error updating status:', error);
    showNotification(`Error updating status: ${error.message}`, 'error');
  }
};

// ✅ FIXED: Handle soft delete properly and show appropriate messages
const handleDeleteUser = async (userId) => {
  if (!window.confirm("Are you sure you want to delete this user? This will mark them as rejected and they won't be able to access the system.")) {
    return;
  }

  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const result = await response.json();
      showNotification(result.message || 'User deleted successfully!', 'success');
      fetchUsers(); // Refresh the list
      fetchStats(); // Refresh stats
    } else {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      showNotification(errorData.message || 'Failed to delete user', 'error');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    showNotification('Error deleting user: ' + error.message, 'error');
  }
};

  // ✅ FIXED: Search and filter logic
  useEffect(() => {
    let filtered = [...users];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user =>
        (user.fname && user.fname.toLowerCase().includes(query)) ||
        (user.lname && user.lname.toLowerCase().includes(query)) ||
        (user.username && user.username.toLowerCase().includes(query)) ||
        (user.email && user.email.toLowerCase().includes(query)) ||
        (user.cName && user.cName.toLowerCase().includes(query)) ||
        (user.companyName && user.companyName.toLowerCase().includes(query)) ||
        (user.nic && user.nic.toLowerCase().includes(query))
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(user => 
        user.accountStatus && user.accountStatus.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    if (filterRole !== 'all') {
      filtered = filtered.filter(user =>
        user.roles && user.roles.some(role => {
          const roleStr = typeof role === 'string' ? role : role.name;
          return roleStr && roleStr.toLowerCase().includes(filterRole.toLowerCase());
        })
      );
    }

    setFilteredUsers(filtered);
  }, [searchQuery, filterStatus, filterRole, users]);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      fetchUsers();
      fetchStats();
    } else {
      showNotification('Please login to access admin panel', 'error');
      setLoading(false);
    }
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
    
    // ✅ Handle both string and object roles
    const roleStr = typeof roles[0] === 'string' ? roles[0] : roles[0].name;
    const roleText = roleStr ? roleStr.replace('ROLE_', '') : 'USER';
    
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
      {/* Notification */}
      {notification && (
        <div className={styles.notification} data-type={notification.type}>
          <div className={styles.notificationContent}>
            {notification.type === 'success' && <CheckCircle size={20} />}
            {notification.type === 'warning' && <AlertCircle size={20} />}
            {notification.type === 'error' && <XCircle size={20} />}
            <span>{notification.message}</span>
          </div>
          <button 
            className={styles.notificationClose}
            onClick={() => setNotification(null)}
          >
            <XCircle size={16} />
          </button>
        </div>
      )}

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>User Management</h1>
            <p className={styles.subtitle}>Manage and monitor all system users</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Building size={24} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statNumber}>{stats.total}</p>
              <p className={styles.statLabel}>Total Users</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Clock size={24} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statNumber}>{stats.pending}</p>
              <p className={styles.statLabel}>Pending</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <CheckCircle size={24} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statNumber}>{stats.approved}</p>
              <p className={styles.statLabel}>Approved</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <XCircle size={24} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statNumber}>{stats.rejected}</p>
              <p className={styles.statLabel}>Rejected</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
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

        {/* Users Table */}
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
                            <div className={styles.userName}>{user.fname} {user.lname}</div>
                            <div className={styles.userCompany}>{user.cName || user.companyName || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={styles.contactInfo}>
                          <div className={styles.contactEmail}>{user.username || user.email}</div>
                          <div className={styles.contactPhone}>{user.tnumber || user.telephone || 'N/A'}</div>
                        </div>
                      </td>
                      <td>{getRoleBadge(user.roles)}</td>
                      <td>{getStatusBadge(user.accountStatus)}</td>
                      <td className={styles.joinedDate}>
                        {user.date || user.registerDate ? new Date(user.date || user.registerDate).toLocaleDateString() : 'N/A'}
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

      {/* View Dialog */}
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
                  <p className={styles.detailValue}>{selectedUser.email || selectedUser.username}</p>
                </div>
                <div className={styles.detailItem}>
                  <label className={styles.detailLabel}>Phone</label>
                  <p className={styles.detailValue}>{selectedUser.telephone || selectedUser.tnumber || 'N/A'}</p>
                </div>
                <div className={styles.detailItem}>
                  <label className={styles.detailLabel}>NIC</label>
                  <p className={styles.detailValue}>{selectedUser.nic || 'N/A'}</p>
                </div>
                <div className={styles.detailItem}>
                  <label className={styles.detailLabel}>Company</label>
                  <p className={styles.detailValue}>{selectedUser.companyName || selectedUser.cName || 'N/A'}</p>
                </div>
                <div className={styles.detailItem}>
                  <label className={styles.detailLabel}>Status</label>
                  <div>{getStatusBadge(selectedUser.accountStatus)}</div>
                </div>
                <div className={styles.detailItem}>
                  <label className={styles.detailLabel}>Registered</label>
                  <p className={styles.detailValue}>
                    {selectedUser.registerDate || selectedUser.date ? new Date(selectedUser.registerDate || selectedUser.date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className={`${styles.detailItem} ${styles.detailItemFull}`}>
                  <label className={styles.detailLabel}>Address</label>
                  <p className={styles.detailValue}>{selectedUser.address || 'N/A'}</p>
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

      {/* Edit Dialog */}
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
                    value={selectedUser.companyName || selectedUser.cName || ''}
                    onChange={(e) => setSelectedUser({...selectedUser, companyName: e.target.value, cName: e.target.value})}
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Phone</label>
                  <input
                    type="text"
                    value={selectedUser.telephone || selectedUser.tnumber || ''}
                    onChange={(e) => setSelectedUser({...selectedUser, telephone: e.target.value, tnumber: e.target.value})}
                    className={styles.formInput}
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.detailItemFull}`}>
                  <label className={styles.formLabel}>Address</label>
                  <textarea
                    value={selectedUser.address || ''}
                    onChange={(e) => setSelectedUser({...selectedUser, address: e.target.value})}
                    className={`${styles.formInput} ${styles.formTextarea}`}
                    rows="3"
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