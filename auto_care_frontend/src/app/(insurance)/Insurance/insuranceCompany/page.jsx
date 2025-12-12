"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Users,
  TrendingUp,
  Award,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  ChevronRight,
  Star,
  CheckCircle,
  AlertTriangle,
  Clock,
  Search,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import styles from "./page.module.css";

export default function InsuranceCompanyPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data for insurance companies
  const insuranceCompanies = [
    {
      id: 1,
      name: "SecureLife Insurance Co.",
      rating: 4.8,
      status: "active",
      email: "contact@securelife.com",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      totalPolicies: 15420,
      claimsProcessed: 98.5,
      coverageTypes: ["Life", "Health", "Auto", "Home"],
      established: 1985,
    },
    {
      id: 2,
      name: "Guardian Shield Insurance",
      rating: 4.6,
      status: "active",
      email: "info@guardianshield.com",
      phone: "+1 (555) 987-6543",
      location: "Los Angeles, CA",
      totalPolicies: 12850,
      claimsProcessed: 97.2,
      coverageTypes: ["Auto", "Home", "Business"],
      established: 1992,
    },
    {
      id: 3,
      name: "Prime Protection Ltd.",
      rating: 4.3,
      status: "pending",
      email: "support@primeprotection.com",
      phone: "+1 (555) 456-7890",
      location: "Chicago, IL",
      totalPolicies: 8920,
      claimsProcessed: 95.8,
      coverageTypes: ["Life", "Health", "Travel"],
      established: 2001,
    },
    {
      id: 4,
      name: "Reliable Insurance Group",
      rating: 4.9,
      status: "active",
      email: "contact@reliable.com",
      phone: "+1 (555) 321-0987",
      location: "Houston, TX",
      totalPolicies: 22100,
      claimsProcessed: 99.1,
      coverageTypes: [
        "Life",
        "Health",
        "Auto",
        "Home",
        "Business",
      ],
      established: 1978,
    },
    {
      id: 5,
      name: "SafeHaven Insurance",
      rating: 4.1,
      status: "suspended",
      email: "info@safehaven.com",
      phone: "+1 (555) 654-3210",
      location: "Miami, FL",
      totalPolicies: 5640,
      claimsProcessed: 92.3,
      coverageTypes: ["Auto", "Home"],
      established: 2005,
    },
  ];

  // Mock recent claims
  const recentClaims = [
    {
      id: "CLM-2025-001",
      type: "Medical",
      amount: "$2,500",
      status: "Approved",
      date: "2025-07-15",
      description: "Emergency room visit",
    },
    {
      id: "CLM-2025-002",
      type: "Auto",
      amount: "$8,200",
      status: "Processing",
      date: "2025-07-22",
      description: "Vehicle collision repair",
    },
    {
      id: "CLM-2025-003",
      type: "Life",
      amount: "$1,200",
      status: "Under Review",
      date: "2025-08-01",
      description: "Policy benefit claim",
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setClaims(recentClaims);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
      case "approved":
        return styles.statusActive;
      case "pending":
      case "processing":
      case "under review":
        return styles.statusPending;
      case "suspended":
        return styles.statusSuspended;
      default:
        return styles.statusPending;
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "active":
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
      case "under review":
        return <Clock className="w-4 h-4" />;
      case "processing":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={i}
          className={`${styles.star} ${styles.starFull}`}
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          className={`${styles.star} ${styles.starHalf}`}
        />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          className={`${styles.star} ${styles.starEmpty}`}
        />
      );
    }

    return stars;
  };

  const filteredCompanies = insuranceCompanies.filter(
    (company) => {
      const matchesSearch =
        company.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        company.location
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        company.email
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || company.status === statusFilter;

      return matchesSearch && matchesStatus;
    }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className={`${styles.container} py-8`}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <h2 className={styles.pageTitle}>
            Insurance Companies
          </h2>
          <button
            className={styles.addButton}
            onClick={() => router.push("/Insurance/newPlan")}
          >
            <Plus className={styles.addIcon} />
            Create a new plan
          </button>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search companies..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles.selectContainer}>
            <select
              className={styles.statusSelect}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
            <ChevronDown className={styles.selectIcon} />
          </div>
        </div>

        {/* Companies Grid */}
        <div className={styles.companiesGrid}>
          {filteredCompanies.map((company) => (
            <div
              key={company.id}
              className={styles.companyCard}
            >
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.companyName}>
                    {company.name}
                  </h3>
                  <div className={styles.starRating}>
                    {renderStarRating(company.rating)}
                    <span className={styles.ratingText}>
                      {company.rating} (
                      {company.totalPolicies} policies)
                    </span>
                  </div>
                </div>
                <span
                  className={`${styles.statusBadge} ${getStatusColor(
                    company.status
                  )}`}
                >
                  {company.status}
                </span>
              </div>

              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <Mail className={styles.contactIcon} />
                  <span>{company.email}</span>
                </div>
                <div className={styles.contactItem}>
                  <Phone className={styles.contactIcon} />
                  <span>{company.phone}</span>
                </div>
                <div className={styles.contactItem}>
                  <MapPin className={styles.contactIcon} />
                  <span>{company.location}</span>
                </div>
              </div>

              <div className={styles.metrics}>
                <div className={styles.metricGroup}>
                  <div className={styles.metric}>
                    <span className={styles.metricLabel}>
                      Total Policies
                    </span>
                    <span className={styles.metricValue}>
                      {company.totalPolicies.toLocaleString()}
                    </span>
                  </div>
                  <div className={styles.metric}>
                    <span className={styles.metricLabel}>
                      Claims Success
                    </span>
                    <span className={styles.metricValue}>
                      {company.claimsProcessed}%
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.coverageTypes}>
                <span className={styles.coverageLabel}>
                  Coverage Types
                </span>
                <div className={styles.coverageTags}>
                  {company.coverageTypes.map((type, index) => (
                    <span
                      key={index}
                      className={styles.coverageTag}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.cardActions}>
                <button className={styles.viewButton}>
                  <Eye className={styles.actionIcon} />
                  View Details
                </button>
                <div className={styles.actionButtons}>
                  <button className={styles.editButton}>
                    <Edit className={styles.actionIcon} />
                  </button>
                  <button className={styles.deleteButton}>
                    <Trash2 className={styles.actionIcon} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No companies found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
