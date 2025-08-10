'use client'

import { useState } from "react"
import { Search, Plus, Eye, Edit, Trash2, Car, User, Shield, Building2, Filter, MapPin, TrendingUp, X } from "lucide-react"
import styles from './page.module.css'

// Component imports
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Badge from "../components/ui/Badge"
import Select from "../components/ui/Select"

// Simple Dialog Component
const Dialog = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className={styles.dialogOverlay} onClick={onClose}>
      <div className={styles.dialogContainer} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className={styles.dialogCloseButton}
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};

const manageVehicles = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [brandFilter, setBrandFilter] = useState("all")
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      title: "2023 Toyota Camry",
      brand: "Toyota",
      model: "Camry",
      year: 2023,
      price: "$28,500",
      seller: "John Doe",
      sellerEmail: "john@example.com",
      status: "Active",
      posted: "2024-02-01",
      views: 156,
      hasInsurance: true,
      hasLeasing: true,
      image: "https://via.placeholder.com/400x240/f1f5f9/64748b?text=Toyota+Camry",
      mileage: "15,000 miles",
      location: "Los Angeles, CA",
      description: "Well-maintained Toyota Camry with excellent fuel efficiency.",
      features: ["Backup Camera", "Bluetooth", "Cruise Control", "Power Windows"]
    },
    {
      id: 2,
      title: "2022 Honda Civic",
      brand: "Honda",
      model: "Civic",
      year: 2022,
      price: "$24,000",
      seller: "Emily Brown",
      sellerEmail: "emily@example.com",
      status: "Under Review",
      posted: "2024-02-05",
      views: 89,
      hasInsurance: false,
      hasLeasing: true,
      image: "https://via.placeholder.com/400x240/f1f5f9/64748b?text=Honda+Civic",
      mileage: "25,000 miles",
      location: "San Francisco, CA",
      description: "Reliable Honda Civic, perfect for city driving.",
      features: ["Apple CarPlay", "Honda Sensing", "Automatic Transmission"]
    },
    {
      id: 3,
      title: "2021 BMW X5",
      brand: "BMW",
      model: "X5",
      year: 2021,
      price: "$45,900",
      seller: "Mike Johnson",
      sellerEmail: "mike@example.com",
      status: "Sold",
      posted: "2024-01-28",
      views: 243,
      hasInsurance: true,
      hasLeasing: false,
      image: "https://via.placeholder.com/400x240/f1f5f9/64748b?text=BMW+X5",
      mileage: "35,000 miles",
      location: "New York, NY",
      description: "Luxury SUV with premium features and excellent performance.",
      features: ["Leather Seats", "Navigation", "Panoramic Sunroof", "AWD"]
    },
    {
      id: 4,
      title: "2023 Ford F-150",
      brand: "Ford",
      model: "F-150",
      year: 2023,
      price: "$52,000",
      seller: "David Lee",
      sellerEmail: "david@example.com",
      status: "Active",
      posted: "2024-02-08",
      views: 201,
      hasInsurance: true,
      hasLeasing: true,
      image: "https://via.placeholder.com/400x240/f1f5f9/64748b?text=Ford+F-150",
      mileage: "8,000 miles",
      location: "Houston, TX",
      description: "Heavy-duty pickup truck, perfect for work and recreation.",
      features: ["4WD", "Towing Package", "Bed Liner", "Crew Cab"]
    }
  ])

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case "Active":
        return styles.badgeActive
      case "Under Review":
        return styles.badgeUnderReview
      case "Sold":
        return styles.badgeSold
      case "Rejected":
        return styles.badgeRejected
      default:
        return styles.badgeGray
    }
  }

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.seller.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter
    const matchesBrand = brandFilter === "all" || vehicle.brand === brandFilter
    return matchesSearch && matchesStatus && matchesBrand
  })

  const handleViewVehicle = (vehicle) => {
    setSelectedVehicle(vehicle)
    setIsViewDialogOpen(true)
  }

  const handleEditVehicle = (vehicle) => {
    setSelectedVehicle(vehicle)
    setIsEditDialogOpen(true)
  }

  const handleStatusChange = (vehicleId, newStatus) => {
    setVehicles(vehicles.map(vehicle => 
      vehicle.id === vehicleId ? { ...vehicle, status: newStatus } : vehicle
    ))
  }

  const handleDeleteVehicle = (vehicleId) => {
    setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleId))
  }

  const uniqueBrands = [...new Set(vehicles.map(v => v.brand))]

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header Section */}
        <div className={styles.headerSection}>
          <div className={styles.header}>
            <div className={styles.titleSection}>
              <h1 className={styles.title}>Vehicle Management</h1>
              <p className={styles.subtitle}>Manage and monitor all vehicle listings</p>
            </div>
            <Button className={styles.addButton}>
              <Plus size={20} />
              Add New Vehicle
            </Button>
          </div>

          {/* Stats Dashboard */}
          <div className={styles.statsGrid}>
            <Card className={styles.statCard}>
              <div className={styles.statContent}>
                <div className={styles.statIconWrapper}>
                  <Car className={styles.statIcon} size={24} />
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statNumber}>{vehicles.length}</div>
                  <div className={styles.statLabel}>Total Vehicles</div>
                  <div className={styles.statChange}>
                    <TrendingUp size={14} />
                    <span>+12% from last month</span>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className={styles.statCard}>
              <div className={styles.statContent}>
                <div className={styles.statIconWrapper}>
                  <Eye className={styles.statIcon} size={24} />
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statNumber}>
                    {vehicles.reduce((sum, v) => sum + v.views, 0).toLocaleString()}
                  </div>
                  <div className={styles.statLabel}>Total Views</div>
                  <div className={styles.statChange}>
                    <TrendingUp size={14} />
                    <span>+8% from last month</span>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className={styles.statCard}>
              <div className={styles.statContent}>
                <div className={styles.statIconWrapper}>
                  <Shield className={styles.statIcon} size={24} />
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statNumber}>
                    {vehicles.filter(v => v.hasInsurance).length}
                  </div>
                  <div className={styles.statLabel}>With Insurance</div>
                  <div className={styles.statChange}>
                    <TrendingUp size={14} />
                    <span>+5% coverage</span>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className={styles.statCard}>
              <div className={styles.statContent}>
                <div className={styles.statIconWrapper}>
                  <Building2 className={styles.statIcon} size={24} />
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statNumber}>
                    {vehicles.filter(v => v.hasLeasing).length}
                  </div>
                  <div className={styles.statLabel}>With Leasing</div>
                  <div className={styles.statChange}>
                    <TrendingUp size={14} />
                    <span>+15% options</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Filters Section */}
        <Card className={styles.filtersCard}>
          <div className={styles.filtersHeader}>
            <h3 className={styles.filtersTitle}>
              <Filter size={20} />
              Search & Filter
            </h3>
          </div>
          <div className={styles.filtersContent}>
            <div className={styles.searchContainer}>
              <Search className={styles.searchIcon} size={20} />
              <Input
                placeholder="Search vehicles by title, seller, or location..."
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
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Under Review">Under Review</option>
                <option value="Sold">Sold</option>
                <option value="Rejected">Rejected</option>
              </Select>
              
              <Select 
                value={brandFilter} 
                onChange={setBrandFilter}
                className={styles.filterSelect}
              >
                <option value="all">All Brands</option>
                {uniqueBrands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </Select>
            </div>
          </div>
        </Card>

        {/* Results Header */}
        <div className={styles.resultsHeader}>
          <h3 className={styles.resultsTitle}>
            Vehicle Listings ({filteredVehicles.length})
          </h3>
        </div>

        {/* Vehicles Grid */}
        <div className={styles.vehiclesGrid}>
          {filteredVehicles.map((vehicle) => (
            <Card key={vehicle.id} className={styles.vehicleCard}>
              <div className={styles.vehicleImage}>
                <img src={vehicle.image} alt={vehicle.title} />
                <div className={styles.vehicleStatus}>
                  <span className={getStatusBadgeClass(vehicle.status)}>
                    {vehicle.status}
                  </span>
                </div>
              </div>
              
              <div className={styles.vehicleContent}>
                <div className={styles.vehicleHeader}>
                  <h3 className={styles.vehicleTitle}>{vehicle.title}</h3>
                  <div className={styles.vehiclePrice}>{vehicle.price}</div>
                </div>
                
                <div className={styles.vehicleDetails}>
                  <div className={styles.vehicleDetail}>
                    <User size={16} />
                    <span>{vehicle.seller}</span>
                  </div>
                  <div className={styles.vehicleDetail}>
                    <MapPin size={16} />
                    <span>{vehicle.location}</span>
                  </div>
                  <div className={styles.vehicleDetail}>
                    <Eye size={16} />
                    <span>{vehicle.views} views • Posted {vehicle.posted}</span>
                  </div>
                </div>
                
                <div className={styles.vehicleServices}>
                  {vehicle.hasInsurance && (
                    <span className={styles.badgeInsurance}>
                      <Shield size={12} />
                      Insurance Available
                    </span>
                  )}
                  {vehicle.hasLeasing && (
                    <span className={styles.badgeLeasing}>
                      <Building2 size={12} />
                      Leasing Options
                    </span>
                  )}
                </div>
                
                <div className={styles.vehicleActions}>
                  <Button 
                    className={styles.viewButton}
                    onClick={() => handleViewVehicle(vehicle)}
                  >
                    <Eye size={16} />
                    View Details
                  </Button>
                  <Button 
                    className={styles.editButton}
                    onClick={() => handleEditVehicle(vehicle)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button 
                    className={styles.deleteButton}
                    onClick={() => handleDeleteVehicle(vehicle.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* View Vehicle Dialog */}
      <Dialog isOpen={isViewDialogOpen} onClose={() => setIsViewDialogOpen(false)}>
        {selectedVehicle && (
          <div className={styles.dialogContent}>
            <div className={styles.dialogHeader}>
              <h2 className={styles.dialogTitle}>Vehicle Details</h2>
            </div>
            <div className={styles.vehicleDetailsDialog}>
              <img 
                src={selectedVehicle.image} 
                alt={selectedVehicle.title}
                className={styles.dialogImage}
              />
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <label>Title:</label>
                  <span>{selectedVehicle.title}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Price:</label>
                  <span className={styles.priceValue}>{selectedVehicle.price}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Brand:</label>
                  <span>{selectedVehicle.brand}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Model:</label>
                  <span>{selectedVehicle.model}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Year:</label>
                  <span>{selectedVehicle.year}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Mileage:</label>
                  <span>{selectedVehicle.mileage}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Location:</label>
                  <span>{selectedVehicle.location}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Seller:</label>
                  <span>{selectedVehicle.seller}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Status:</label>
                  <span className={getStatusBadgeClass(selectedVehicle.status)}>
                    {selectedVehicle.status}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <label>Posted:</label>
                  <span>{selectedVehicle.posted}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Views:</label>
                  <span>{selectedVehicle.views}</span>
                </div>
              </div>
              <div className={styles.detailSection}>
                <label>Description:</label>
                <p className={styles.descriptionText}>{selectedVehicle.description}</p>
              </div>
              <div className={styles.detailSection}>
                <label>Features:</label>
                <div className={styles.featuresList}>
                  {selectedVehicle.features.map((feature, index) => (
                    <span key={index} className={styles.featureBadge}>
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  )
}

export default manageVehicles