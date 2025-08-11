
'use client'

import { useState, useEffect } from "react"
import axios from "axios"
import { Search, CheckCircle, XCircle, Eye, ShieldCheck } from "lucide-react"
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
  const [filter, setFilter] = useState("pending") // pending, approved

  useEffect(() => {
    const fetchAds = async () => {
      try {
        // NOTE: Please ensure you have a backend endpoint like GET /admin/getallads
        // that returns all advertisements.
        const response = await axios.get("http://localhost:8080/admin/getallads");
        const formattedAds = response.data.map(ad => ({
          id: ad.id,
          title: ad.title,
          seller: ad.sellerName, // Assuming these fields from backend
          price: ad.price,
          status: ad.falg === 1 ? 'Approved' : 'Pending',
          date: ad.datePosted ? new Date(ad.datePosted).toLocaleDateString() : 'N/A'
        }));
        setAds(formattedAds);
      } catch (error) {
        console.error("Error fetching ads:", error);
        // Mock data for demonstration if the endpoint doesn't exist yet
        setAds([
          { id: 1, title: "Toyota Camry 2021", seller: "John Doe", price: 25000, status: "Pending", date: "2024-02-12" },
          { id: 2, title: "Honda Civic 2020", seller: "Jane Smith", price: 22000, status: "Approved", date: "2024-02-11" },
          { id: 3, title: "Ford Mustang 2022", seller: "Mike Brown", price: 45000, status: "Pending", date: "2024-02-13" },
        ]);
      }
    };

    fetchAds();
  }, []);

  const handleConfirmAd = async (adId) => {
    try {
      // NOTE: The backend endpoint has a typo 'confrim'. It should be 'confirm'.
      await axios.put(`http://localhost:8080/admin/confrim/${adId}`);
      setAds(ads.map(ad => ad.id === adId ? { ...ad, status: 'Approved' } : ad));
    } catch (error) {
      console.error("Error confirming ad:", error);
      // Add user feedback here, e.g., a toast notification
    }
  };

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.seller.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || ad.status.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    totalAds: ads.length,
    pendingAds: ads.filter(ad => ad.status === 'Pending').length,
    approvedAds: ads.filter(ad => ad.status === 'Approved').length,
  };

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
                  placeholder="Search by title or seller..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
              <div className={styles.filters}>
                <Button onClick={() => setFilter('all')} className={filter === 'all' ? styles.activeFilter : styles.filterButton}>All</Button>
                <Button onClick={() => setFilter('pending')} className={filter === 'pending' ? styles.activeFilter : styles.filterButton}>Pending</Button>
                <Button onClick={() => setFilter('approved')} className={filter === 'approved' ? styles.activeFilter : styles.filterButton}>Approved</Button>
              </div>
            </Card>

            {/* Ads Table */}
            <Card className={styles.tableCard}>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Advertisement</th>
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
                        <td>{ad.title}</td>
                        <td>{ad.seller}</td>
                        <td>${ad.price.toLocaleString()}</td>
                        <td>{ad.date}</td>
                        <td>
                          <Badge className={ad.status === 'Approved' ? styles.approvedBadge : styles.pendingBadge}>
                            {ad.status}
                          </Badge>
                        </td>
                        <td>
                          {ad.status === 'Pending' && (
                            <Button 
                              className={styles.approveButton}
                              onClick={() => handleConfirmAd(ad.id)}
                            >
                              <ShieldCheck size={16} />
                              Approve
                            </Button>
                          )}
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
    </SidebarProvider>
  )
}

export default ManageAdsPage
