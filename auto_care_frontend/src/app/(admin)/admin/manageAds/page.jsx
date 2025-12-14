'use client'

import { useState, useEffect } from "react"
import { api } from "@/utils/axios"
import { Search, CheckCircle, XCircle, Eye, ShieldCheck, Trash2, AlertCircle } from "lucide-react"
import styles from './page.module.css'

// Component imports
import SidebarProvider from "../components/ui/SidebarProvider"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Badge from "../components/ui/Badge"

const ManageAdsPage = () => {
  const [ads, setAds] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("pending")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAds()
  }, [filter])

  const fetchAds = async () => {
    try {
      setLoading(true)
      setError(null)
      
      let endpoint = '/admin/advertisements/all'
      if (filter === 'pending') {
        endpoint = '/admin/advertisements/pending'
      } else if (filter === 'approved') {
        endpoint = '/admin/advertisements/approved'
      }

      console.log('📡 Fetching from:', endpoint)
      const response = await api.get(endpoint)
      
      console.log('✅ Response received:', response.data.length, 'ads')
      
      const formattedAds = response.data.map(ad => ({
        id: ad.id,
        title: ad.title || 'Untitled',
        seller: ad.name || 'Unknown Seller',
        email: ad.email || 'N/A',
        phone: ad.t_number || 'N/A',
        price: ad.price || '0',
        location: ad.location || 'N/A',
        manufacturer: ad.manufacturer || 'N/A',
        model: ad.model || 'N/A',
        year: ad.m_year || 'N/A',
        mileage: ad.mileage || 'N/A',
        condition: ad.v_condition || 'N/A',
        transmission: ad.transmission || 'N/A',
        fuelType: ad.fuel_type || 'N/A',
        colour: ad.colour || 'N/A',
        description: ad.description || 'No description',
        // FIXED: Use ad.flag instead of ad.falg
        status: ad.flag === 1 ? 'Approved' : ad.flag === 0 ? 'Pending' : 'Rejected',
        // FIXED: Use ad.time instead of ad.datetime
        date: ad.time ? new Date(ad.time).toLocaleDateString() : 'N/A',
        image1: ad.image1,
        image2: ad.image2,
        image3: ad.image3,
        image4: ad.image4,
        image5: ad.image5,
        rawData: ad
      }))
      
      setAds(formattedAds)
    } catch (error) {
      console.error("❌ Error fetching ads:", error)
      console.error("Error details:", error.response?.data)
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError('Authentication failed. You may not have admin permissions or your session has expired. Please login again.')
      } else {
        setError(error.response?.data?.message || "Failed to fetch advertisements")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleApproveAd = async (adId) => {
    if (!window.confirm('Are you sure you want to approve this advertisement?')) {
      return
    }

    try {
      await api.put(`/admin/advertisements/${adId}/approve`)
      
      alert('Advertisement approved successfully!')
      fetchAds()
    } catch (error) {
      console.error("Error approving ad:", error)
      alert(error.response?.data?.message || "Failed to approve advertisement")
    }
  }

  const handleRejectAd = async (adId) => {
    if (!window.confirm('Are you sure you want to reject and delete this advertisement? This action cannot be undone.')) {
      return
    }

    try {
      await api.delete(`/admin/advertisements/${adId}/reject`)
      
      alert('Advertisement rejected and deleted successfully!')
      fetchAds()
    } catch (error) {
      console.error("Error rejecting ad:", error)
      alert(error.response?.data?.message || "Failed to reject advertisement")
    }
  }

  const handleViewDetails = (ad) => {
    const details = `
Advertisement Details:
━━━━━━━━━━━━━━━━━━━━
Title: ${ad.title}
Seller: ${ad.seller}
Email: ${ad.email}
Phone: ${ad.phone}
Location: ${ad.location}

Vehicle Information:
━━━━━━━━━━━━━━━━━━━━
Manufacturer: ${ad.manufacturer}
Model: ${ad.model}
Year: ${ad.year}
Condition: ${ad.condition}
Mileage: ${ad.mileage}
Transmission: ${ad.transmission}
Fuel Type: ${ad.fuelType}
Colour: ${ad.colour}

Price: $${ad.price}

Description:
${ad.description}
    `
    alert(details)
  }

  const filteredAds = ads.filter(ad => {
    const matchesSearch = 
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  const stats = {
    totalAds: ads.length,
    pendingAds: ads.filter(ad => ad.status === 'Pending').length,
    approvedAds: ads.filter(ad => ad.status === 'Approved').length,
  }

  if (loading && ads.length === 0) {
    return (
      <SidebarProvider>
        <div className={styles.container}>
          <div className={styles.main}>
            <div className={styles.content}>
              <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Loading advertisements...</p>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.content}>
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerContent}>
                <h1 className={styles.title}>Manage Advertisements</h1>
                <p className={styles.subtitle}>Approve or reject vehicle advertisements</p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <Card className={styles.errorCard}>
                <AlertCircle size={20} />
                <span>{error}</span>
                <Button onClick={fetchAds} className={styles.retryButton}>Retry</Button>
              </Card>
            )}

            {/* Stats */}
            <div className={styles.statsGrid}>
              <Card className={styles.statCard}>
                <div className={styles.statIcon}><Eye size={24} /></div>
                <div className={styles.statContent}>
                  <div className={styles.statNumber}>{stats.totalAds}</div>
                  <div className={styles.statLabel}>Total Ads</div>
                </div>
              </Card>
              <Card className={styles.statCard}>
                <div className={styles.statIcon}><XCircle size={24} /></div>
                <div className={styles.statContent}>
                  <div className={styles.statNumber}>{stats.pendingAds}</div>
                  <div className={styles.statLabel}>Pending Approval</div>
                </div>
              </Card>
              <Card className={styles.statCard}>
                <div className={styles.statIcon}><CheckCircle size={24} /></div>
                <div className={styles.statContent}>
                  <div className={styles.statNumber}>{stats.approvedAds}</div>
                  <div className={styles.statLabel}>Approved Ads</div>
                </div>
              </Card>
            </div>

            {/* Search and Filter */}
            <Card className={styles.searchCard}>
              <div className={styles.searchContainer}>
                <Search className={styles.searchIcon} size={20} />
                <Input
                  placeholder="Search by title, seller, manufacturer, or model..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
              <div className={styles.filters}>
                <Button 
                  onClick={() => setFilter('all')} 
                  className={filter === 'all' ? styles.activeFilter : styles.filterButton}
                >
                  All
                </Button>
                <Button 
                  onClick={() => setFilter('pending')} 
                  className={filter === 'pending' ? styles.activeFilter : styles.filterButton}
                >
                  Pending
                </Button>
                <Button 
                  onClick={() => setFilter('approved')} 
                  className={filter === 'approved' ? styles.activeFilter : styles.filterButton}
                >
                  Approved
                </Button>
              </div>
            </Card>

            {/* Ads Table */}
            <Card className={styles.tableCard}>
              <div className={styles.tableContainer}>
                {filteredAds.length === 0 ? (
                  <div className={styles.emptyState}>
                    <AlertCircle size={48} />
                    <h3>No advertisements found</h3>
                    <p>There are no advertisements matching your criteria.</p>
                  </div>
                ) : (
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Advertisement</th>
                        <th>Vehicle</th>
                        <th>Seller</th>
                        <th>Price</th>
                        <th>Date Posted</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAds.map((ad) => (
                        <tr key={ad.id}>
                          <td>#{ad.id}</td>
                          <td>
                            <div className={styles.adTitle}>
                              {ad.title}
                              {ad.image1 && (
                                <img 
                                  src={ad.image1} 
                                  alt={ad.title} 
                                  className={styles.thumbnail}
                                />
                              )}
                            </div>
                          </td>
                          <td>
                            <div className={styles.vehicleInfo}>
                              <strong>{ad.manufacturer} {ad.model}</strong>
                              <small>{ad.year}</small>
                            </div>
                          </td>
                          <td>
                            <div className={styles.sellerInfo}>
                              <div>{ad.seller}</div>
                              <small>{ad.phone}</small>
                            </div>
                          </td>
                          <td>
                            <strong className={styles.price}>
                              ${parseFloat(ad.price).toLocaleString()}
                            </strong>
                          </td>
                          <td>{ad.date}</td>
                          <td>
                            <Badge 
                              className={
                                ad.status === 'Approved' 
                                  ? styles.approvedBadge 
                                  : ad.status === 'Pending'
                                  ? styles.pendingBadge
                                  : styles.rejectedBadge
                              }
                            >
                              {ad.status}
                            </Badge>
                          </td>
                          <td>
                            <div className={styles.actionButtons}>
                              <Button 
                                className={styles.viewButton}
                                onClick={() => handleViewDetails(ad)}
                                title="View Details"
                              >
                                <Eye size={16} />
                              </Button>
                              {ad.status === 'Pending' && (
                                <>
                                  <Button 
                                    className={styles.approveButton}
                                    onClick={() => handleApproveAd(ad.id)}
                                    title="Approve"
                                  >
                                    <ShieldCheck size={16} />
                                  </Button>
                                  <Button 
                                    className={styles.rejectButton}
                                    onClick={() => handleRejectAd(ad.id)}
                                    title="Reject"
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default ManageAdsPage