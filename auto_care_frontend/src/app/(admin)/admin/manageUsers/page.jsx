'use client'

import { useState, useEffect } from "react"
import axios from "axios"
import { Search, Plus, Eye, Edit, Trash2, UserCheck, UserX, Filter, Users, UserPlus, Shield } from "lucide-react"
import styles from './page.module.css'

// Component imports
import SidebarProvider from "../components/ui/SidebarProvider"
import AppSidebar from "../components/AppSidebar"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Badge from "../components/ui/Badge"
import Dialog from "../components/ui/Dialog"
import Select from "../components/ui/Select"

const manageUsers = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // IMPORTANT: Replace with your actual backend URL
        const response = await axios.get("http://localhost:8080/admin/getallusers");
        const formattedUsers = response.data.map(user => ({
          id: user.id,
          name: user.username, // Assuming 'username' from backend
          email: user.email,
          role: "Customer", // Endpoint fetches ROLE_USER
          status: "Active", // Default status
          joined: "2024-01-01", // Placeholder for join date
          vehicles: 0, // Placeholder
          phone: "N/A", // Placeholder
          address: "N/A" // Placeholder
        }));
        setUsers(formattedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        // You might want to set an error state here to show a message in the UI
      }
    };

    fetchUsers();
  }, []);

  const pendingRegistrations = [
    {
      id: 6,
      name: "Global Leasing Corp",
      email: "contact@globalleasing.com",
      type: "Leasing Company",
      submitted: "2024-02-10",
      documents: ["Business License", "Insurance Certificate"]
    },
    {
      id: 7,
      name: "SafeDrive Insurance",
      email: "admin@safedrive.com",
      type: "Insurance Company",
      submitted: "2024-02-09",
      documents: ["Insurance License", "Financial Statement"]
    }
  ]

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === "Active").length,
    totalViews: 689,
    withInsurance: users.filter(u => u.role === "Insurance Company").length
  }

  const getStatusBadge = (status) => {
    const variants = {
      "Active": "bg-green-500/20 text-green-300 border-green-500/30",
      "Pending": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      "Suspended": "bg-red-500/20 text-red-300 border-red-500/30"
    }
    return variants[status] || "bg-gray-500/20 text-gray-300"
  }

  const getRoleBadge = (role) => {
    const variants = {
      "Customer": "bg-blue-500/20 text-blue-300 border-blue-500/30",
      "Leasing Company": "bg-purple-500/20 text-purple-300 border-purple-500/30",
      "Insurance Company": "bg-orange-500/20 text-orange-300 border-orange-500/30"
    }
    return variants[role] || "bg-gray-500/20 text-gray-300"
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleViewUser = (user) => {
    setSelectedUser(user)
    setIsViewDialogOpen(true)
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true)
  }

  const handleStatusChange = (userId, newStatus) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ))
  }

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId))
  }

  const handleApproveRegistration = (regId) => {
    const registration = pendingRegistrations.find(reg => reg.id === regId)
    if (registration) {
      const newUser = {
        id: Date.now(),
        name: registration.name,
        email: registration.email,
        role: registration.type,
        status: "Active",
        joined: new Date().toISOString().split('T')[0],
        vehicles: 0,
        phone: "Not provided",
        address: "Not provided"
      }
      setUsers([...users, newUser])
    }
  }

  return (
    <SidebarProvider>
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.content}>
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerContent}>
                <h1 className={styles.title}>User Management</h1>
                <p className={styles.subtitle}>Manage and monitor all user accounts</p>
              </div>
              <Button className={styles.addButton}>
                <Plus size={20} />
                Add New User
              </Button>
            </div>

            {/* Stats Cards */}
            <div className={styles.statsGrid}>
              <Card className={styles.statCard}>
                <div className={styles.statIcon}>
                  <Users size={24} />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statNumber}>{stats.totalUsers}</div>
                  <div className={styles.statLabel}>Total Users</div>
                  <div className={styles.statTrend}>+12% from last month</div>
                </div>
              </Card>

              <Card className={styles.statCard}>
                <div className={styles.statIcon}>
                  <Eye size={24} />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statNumber}>{stats.totalViews}</div>
                  <div className={styles.statLabel}>Total Views</div>
                  <div className={styles.statTrend}>+8% from last month</div>
                </div>
              </Card>

              <Card className={styles.statCard}>
                <div className={styles.statIcon}>
                  <Shield size={24} />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statNumber}>{stats.withInsurance}</div>
                  <div className={styles.statLabel}>With Insurance</div>
                  <div className={styles.statTrend}>+5% coverage</div>
                </div>
              </Card>

              <Card className={styles.statCard}>
                <div className={styles.statIcon}>
                  <UserPlus size={24} />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statNumber}>{stats.activeUsers}</div>
                  <div className={styles.statLabel}>Active Users</div>
                  <div className={styles.statTrend}>+15% active</div>
                </div>
              </Card>
            </div>

            {/* Pending Registrations */}
            {pendingRegistrations.length > 0 && (
              <Card className={styles.pendingCard}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Pending Registrations</h2>
                  <Badge className="bg-yellow-500/20 text-yellow-300">
                    {pendingRegistrations.length} pending
                  </Badge>
                </div>
                <div className={styles.cardContent}>
                  {pendingRegistrations.map((registration) => (
                    <div key={registration.id} className={styles.registrationItem}>
                      <div className={styles.registrationInfo}>
                        <h3 className={styles.registrationName}>{registration.name}</h3>
                        <p className={styles.registrationDetails}>
                          {registration.email} • {registration.type}
                        </p>
                        <p className={styles.registrationDate}>
                          Submitted: {registration.submitted}
                        </p>
                      </div>
                      <div className={styles.registrationActions}>
                        <Button 
                          className={styles.approveButton}
                          onClick={() => handleApproveRegistration(registration.id)}
                        >
                          <UserCheck size={16} />
                          Approve
                        </Button>
                        <Button className={styles.rejectButton}>
                          <UserX size={16} />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Search and Filter */}
            <Card className={styles.searchCard}>
              <div className={styles.searchHeader}>
                <Filter size={20} />
                <span className={styles.searchTitle}>Search & Filter</span>
              </div>
              <div className={styles.searchContent}>
                <div className={styles.searchContainer}>
                  <Search className={styles.searchIcon} size={20} />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
                
                <div className={styles.filters}>
                  <Select 
                    value={statusFilter} 
                    onChange={setStatusFilter}
                    className={styles.filterSelect}
                  >
                    <option value="all">Status</option>
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Suspended">Suspended</option>
                  </Select>
                  
                  <Select 
                    value={roleFilter} 
                    onChange={setRoleFilter}
                    className={styles.filterSelect}
                  >
                    <option value="all">All Roles</option>
                    <option value="Customer">Customer</option>
                    <option value="Leasing Company">Leasing Company</option>
                    <option value="Insurance Company">Insurance Company</option>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Users Table */}
            <Card className={styles.tableCard}>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Vehicles</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className={styles.userInfo}>
                            <div className={styles.userAvatar}>
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className={styles.userName}>{user.name}</div>
                              <div className={styles.userEmail}>{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <Badge className={getRoleBadge(user.role)}>
                            {user.role}
                          </Badge>
                        </td>
                        <td>
                          <Badge className={getStatusBadge(user.status)}>
                            {user.status}
                          </Badge>
                        </td>
                        <td className={styles.joinedDate}>{user.joined}</td>
                        <td className={styles.vehicleCount}>{user.vehicles}</td>
                        <td>
                          <div className={styles.actions}>
                            <Button 
                              className={styles.actionButton}
                              onClick={() => handleViewUser(user)}
                            >
                              <Eye size={16} />
                            </Button>
                            <Button 
                              className={styles.actionButton}
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button 
                              className={styles.deleteButton}
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* View User Dialog */}
      <Dialog isOpen={isViewDialogOpen} onClose={() => setIsViewDialogOpen(false)}>
        {selectedUser && (
          <div className={styles.dialogContent}>
            <h2 className={styles.dialogTitle}>User Details</h2>
            <div className={styles.userDetails}>
              <div className={styles.detailItem}>
                <label>Name:</label>
                <span>{selectedUser.name}</span>
              </div>
              <div className={styles.detailItem}>
                <label>Email:</label>
                <span>{selectedUser.email}</span>
              </div>
              <div className={styles.detailItem}>
                <label>Phone:</label>
                <span>{selectedUser.phone}</span>
              </div>
              <div className={styles.detailItem}>
                <label>Role:</label>
                <Badge className={getRoleBadge(selectedUser.role)}>
                  {selectedUser.role}
                </Badge>
              </div>
              <div className={styles.detailItem}>
                <label>Status:</label>
                <Badge className={getStatusBadge(selectedUser.status)}>
                  {selectedUser.status}
                </Badge>
              </div>
              <div className={styles.detailItem}>
                <label>Joined:</label>
                <span>{selectedUser.joined}</span>
              </div>
              <div className={styles.detailItem}>
                <label>Vehicles:</label>
                <span>{selectedUser.vehicles}</span>
              </div>
              <div className={styles.detailItem}>
                <label>Address:</label>
                <span>{selectedUser.address}</span>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </SidebarProvider>
  )
}

export default manageUsers