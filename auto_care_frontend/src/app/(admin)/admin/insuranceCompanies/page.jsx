
'use client'

import { useState, useEffect } from "react"
import { api } from "@/utils/axios"
import { Search, Plus, Eye, Edit, Trash2, Shield } from "lucide-react"
import styles from './page.module.css'

// Component imports from the UI library
import SidebarProvider from "../components/ui/SidebarProvider"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Badge from "../components/ui/Badge"
import Dialog from "../components/ui/Dialog"

const InsuranceCompaniesPage = () => {
  const [companies, setCompanies] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get("/admin/getallicompany");
        const formattedCompanies = response.data.map(company => ({
          id: company.id,
          name: company.username,
          email: company.email,
          status: "Active", // Default
          joined: company.createdAt ? new Date(company.createdAt).toISOString().split('T')[0] : "2024-01-01",
          policiesIssued: 0, // Placeholder
          phone: "N/A", // Placeholder
          address: "N/A" // Placeholder
        }));
        setCompanies(formattedCompanies);
      } catch (error) {
        console.error("Error fetching insurance companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewCompany = (company) => {
    setSelectedCompany(company)
    setIsViewDialogOpen(true)
  }
  
  const stats = {
    totalCompanies: companies.length,
    activeCompanies: companies.filter(c => c.status === "Active").length,
    totalPoliciesIssued: companies.reduce((acc, c) => acc + c.policiesIssued, 0)
  };

  return (
    <SidebarProvider>
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.content}>
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerContent}>
                <h1 className={styles.title}>Insurance Companies</h1>
                <p className={styles.subtitle}>Manage insurance company accounts</p>
              </div>
              <Button className={styles.addButton}>
                <Plus size={20} />
                Add New Company
              </Button>
            </div>

            {/* Stats Cards */}
            <div className={styles.statsGrid}>
                <Card className={styles.statCard}>
                    <div className={styles.statIcon}><Shield size={24} /></div>
                    <div className={styles.statContent}>
                        <div className={styles.statNumber}>{stats.totalCompanies}</div>
                        <div className={styles.statLabel}>Total Companies</div>
                    </div>
                </Card>
                <Card className={styles.statCard}>
                    <div className={styles.statIcon}><Shield size={24} /></div>
                    <div className={styles.statContent}>
                        <div className={styles.statNumber}>{stats.activeCompanies}</div>
                        <div className={styles.statLabel}>Active Companies</div>
                    </div>
                </Card>
                <Card className={styles.statCard}>
                    <div className={styles.statIcon}><Shield size={24} /></div>
                    <div className={styles.statContent}>
                        <div className={styles.statNumber}>{stats.totalPoliciesIssued}</div>
                        <div className={styles.statLabel}>Policies Issued</div>
                    </div>
                </Card>
            </div>

            {/* Search */}
            <Card className={styles.searchCard}>
                <div className={styles.searchContainer}>
                  <Search className={styles.searchIcon} size={20} />
                  <Input
                    placeholder="Search by company name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
            </Card>

            {/* Companies Table */}
            <Card className={styles.tableCard}>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Policies Issued</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCompanies.map((company) => (
                      <tr key={company.id}>
                        <td>
                          <div className={styles.userInfo}>
                            <div className={styles.userAvatar}>
                              {company.name.charAt(0)}
                            </div>
                            <div>
                              <div className={styles.userName}>{company.name}</div>
                              <div className={styles.userEmail}>{company.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <Badge className={styles.activeBadge}>
                            {company.status}
                          </Badge>
                        </td>
                        <td className={styles.joinedDate}>{company.joined}</td>
                        <td className={styles.vehicleCount}>{company.policiesIssued}</td>
                        <td>
                          <div className={styles.actions}>
                            <Button 
                              className={styles.actionButton}
                              onClick={() => handleViewCompany(company)}
                            >
                              <Eye size={16} />
                            </Button>
                            <Button className={styles.actionButton}>
                              <Edit size={16} />
                            </Button>
                            <Button className={styles.deleteButton}>
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

      {/* View Company Dialog */}
      <Dialog isOpen={isViewDialogOpen} onClose={() => setIsViewDialogOpen(false)}>
        {selectedCompany && (
          <div className={styles.dialogContent}>
            <h2 className={styles.dialogTitle}>Company Details</h2>
            <div className={styles.userDetails}>
              <div className={styles.detailItem}><label>Name:</label><span>{selectedCompany.name}</span></div>
              <div className={styles.detailItem}><label>Email:</label><span>{selectedCompany.email}</span></div>
              <div className={styles.detailItem}><label>Phone:</label><span>{selectedCompany.phone}</span></div>
              <div className={styles.detailItem}><label>Status:</label><Badge className={styles.activeBadge}>{selectedCompany.status}</Badge></div>
              <div className={styles.detailItem}><label>Joined:</label><span>{selectedCompany.joined}</span></div>
              <div className={styles.detailItem}><label>Policies Issued:</label><span>{selectedCompany.policiesIssued}</span></div>
              <div className={styles.detailItem}><label>Address:</label><span>{selectedCompany.address}</span></div>
            </div>
          </div>
        )}
      </Dialog>
    </SidebarProvider>
  )
}

export default InsuranceCompaniesPage
