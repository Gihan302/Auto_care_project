'use client'

import { useState } from "react"
import { 
  Calendar, 
  Download, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  DollarSign,
  Car,
  FileText,
  Shield,
  Users
} from "lucide-react"
import styles from './page.module.css'

const ReportsAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Monthly")

  // Sample data for charts
  const userActivityData = [
    { month: 'Jan', newUsers: 120, vehicleListings: 85, loanApplications: 45 },
    { month: 'Feb', newUsers: 180, vehicleListings: 120, loanApplications: 65 },
    { month: 'Mar', newUsers: 150, vehicleListings: 95, loanApplications: 55 },
    { month: 'Apr', newUsers: 220, vehicleListings: 160, loanApplications: 75 },
    { month: 'May', newUsers: 280, vehicleListings: 190, loanApplications: 85 },
    { month: 'Jun', newUsers: 320, vehicleListings: 225, loanApplications: 102 }
  ]

  const loanTrendsData = [
    { month: 'Jan', approved: 25, pending: 15, rejected: 10 },
    { month: 'Feb', approved: 35, pending: 18, rejected: 12 },
    { month: 'Mar', approved: 42, pending: 20, rejected: 15 },
    { month: 'Apr', approved: 55, pending: 22, rejected: 18 },
    { month: 'May', approved: 72, pending: 25, rejected: 20 },
    { month: 'Jun', approved: 85, pending: 28, rejected: 22 }
  ]

  const vehicleBrandData = [
    { brand: 'Toyota', sales: 145, percentage: 28, color: '#ef4444' },
    { brand: 'Honda', sales: 120, percentage: 23, color: '#84cc16' },
    { brand: 'Ford', sales: 95, percentage: 18, color: '#10b981' },
    { brand: 'BMW', sales: 80, percentage: 15, color: '#3b82f6' },
    { brand: 'Others', sales: 85, percentage: 16, color: '#8b5cf6' }
  ]

  const insuranceCoverageData = [
    { type: 'Comprehensive', percentage: 48, color: '#8b5cf6' },
    { type: 'Collision', percentage: 35, color: '#10b981' },
    { type: 'Liability', percentage: 20, color: '#f59e0b' }
  ]

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Reports & Analytics</h1>
            <p className={styles.subtitle}>Monitor performance and track key metrics</p>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.periodSelector}>
              <Calendar className={styles.calendarIcon} />
              <select 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className={styles.periodSelect}
              >
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
            <button className={styles.exportButton}>
              <Download className={styles.exportIcon} />
              Export Report
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Total Revenue</span>
              <DollarSign className={styles.statIcon} />
            </div>
            <div className={styles.statValue}>$2.4M</div>
            <div className={styles.statChange}>
              <TrendingUp className={styles.trendIcon} />
              <span className={styles.positiveChange}>+12.5%</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Active Loans</span>
              <FileText className={styles.statIcon} />
            </div>
            <div className={styles.statValue}>1,245</div>
            <div className={styles.statChange}>
              <TrendingUp className={styles.trendIcon} />
              <span className={styles.positiveChange}>+8.2%</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Vehicle Sales</span>
              <Car className={styles.statIcon} />
            </div>
            <div className={styles.statValue}>425</div>
            <div className={styles.statChange}>
              <TrendingDown className={styles.trendIcon} />
              <span className={styles.negativeChange}>-3.1%</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Insurance Claims</span>
              <Shield className={styles.statIcon} />
            </div>
            <div className={styles.statValue}>89</div>
            <div className={styles.statChange}>
              <TrendingUp className={styles.trendIcon} />
              <span className={styles.positiveChange}>+15.7%</span>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className={styles.chartsRow}>
          {/* User Activity Trends */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div className={styles.chartTitle}>
                <BarChart3 className={styles.chartIcon} />
                User Activity Trends
              </div>
            </div>
            <div className={styles.chartContent}>
              <div className={styles.barChart}>
                {userActivityData.map((data, index) => (
                  <div key={data.month} className={styles.barGroup}>
                    <div className={styles.barContainer}>
                      <div 
                        className={`${styles.bar} ${styles.newUsersBar}`}
                        style={{ height: `${(data.newUsers / 320) * 100}%` }}
                      ></div>
                      <div 
                        className={`${styles.bar} ${styles.vehicleListingsBar}`}
                        style={{ height: `${(data.vehicleListings / 320) * 100}%` }}
                      ></div>
                      <div 
                        className={`${styles.bar} ${styles.loanApplicationsBar}`}
                        style={{ height: `${(data.loanApplications / 320) * 100}%` }}
                      ></div>
                    </div>
                    <span className={styles.barLabel}>{data.month}</span>
                  </div>
                ))}
              </div>
              <div className={styles.chartLegend}>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendColor} ${styles.newUsersColor}`}></div>
                  <span>New Users: 320</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendColor} ${styles.vehicleListingsColor}`}></div>
                  <span>Vehicle Listings: 225</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendColor} ${styles.loanApplicationsColor}`}></div>
                  <span>Loan Applications: 102</span>
                </div>
              </div>
            </div>
          </div>

          {/* Loan Application Trends */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div className={styles.chartTitle}>
                <Activity className={styles.chartIcon} />
                Loan Application Trends
              </div>
            </div>
            <div className={styles.chartContent}>
              <div className={styles.lineChart}>
                <svg viewBox="0 0 400 200" className={styles.lineChartSvg}>
                  {/* Grid lines */}
                  {[0, 25, 50, 75, 100].map(y => (
                    <line 
                      key={y} 
                      x1="40" 
                      y1={160 - (y * 1.2)} 
                      x2="360" 
                      y2={160 - (y * 1.2)} 
                      stroke="#f3f4f6" 
                      strokeWidth="1"
                    />
                  ))}
                  
                  {/* Approved line */}
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    points="60,135 120,118 180,110 240,94 300,74 360,58"
                  />
                  
                  {/* Pending line */}
                  <polyline
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    points="60,142 120,138 180,136 240,134 300,130 360,128"
                  />
                  
                  {/* Rejected line */}
                  <polyline
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="3"
                    points="60,148 120,146 180,142 240,138 300,136 360,134"
                  />
                  
                  {/* Data points */}
                  {loanTrendsData.map((data, index) => (
                    <g key={data.month}>
                      <circle cx={60 + index * 60} cy={160 - data.approved * 1.2} r="4" fill="#10b981" />
                      <circle cx={60 + index * 60} cy={160 - data.pending * 1.2} r="4" fill="#f59e0b" />
                      <circle cx={60 + index * 60} cy={160 - data.rejected * 1.2} r="4" fill="#ef4444" />
                    </g>
                  ))}
                  
                  {/* Month labels */}
                  {loanTrendsData.map((data, index) => (
                    <text 
                      key={data.month} 
                      x={60 + index * 60} 
                      y="180" 
                      textAnchor="middle" 
                      fontSize="12" 
                      fill="#6b7280"
                    >
                      {data.month}
                    </text>
                  ))}
                </svg>
              </div>
              <div className={styles.chartLegend}>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendColor} ${styles.approvedColor}`}></div>
                  <span>Approved</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendColor} ${styles.pendingColor}`}></div>
                  <span>Pending</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendColor} ${styles.rejectedColor}`}></div>
                  <span>Rejected</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className={styles.chartsRow}>
          {/* Vehicle Sales by Brand */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div className={styles.chartTitle}>
                <PieChart className={styles.chartIcon} />
                Vehicle Sales by Brand
              </div>
            </div>
            <div className={styles.chartContent}>
              <div className={styles.pieChartContainer}>
                <div className={styles.pieChart}>
                  <svg viewBox="0 0 200 200" className={styles.pieChartSvg}>
                    <circle cx="100" cy="100" r="80" fill="#ef4444" strokeWidth="20" stroke="white" />
                    <circle cx="100" cy="100" r="80" fill="#84cc16" strokeWidth="20" stroke="white" 
                            strokeDasharray="115 400" strokeDashoffset="0" transform="rotate(101 100 100)" />
                    <circle cx="100" cy="100" r="80" fill="#10b981" strokeWidth="20" stroke="white" 
                            strokeDasharray="90 400" strokeDashoffset="0" transform="rotate(194 100 100)" />
                    <circle cx="100" cy="100" r="80" fill="#3b82f6" strokeWidth="20" stroke="white" 
                            strokeDasharray="75 400" strokeDashoffset="0" transform="rotate(266 100 100)" />
                    <circle cx="100" cy="100" r="80" fill="#8b5cf6" strokeWidth="20" stroke="white" 
                            strokeDasharray="80 400" strokeDashoffset="0" transform="rotate(320 100 100)" />
                    <circle cx="100" cy="100" r="40" fill="white" />
                  </svg>
                </div>
                <div className={styles.brandLegend}>
                  {vehicleBrandData.map((brand, index) => (
                    <div key={brand.brand} className={styles.brandItem}>
                      <div 
                        className={styles.brandColor} 
                        style={{ backgroundColor: brand.color }}
                      ></div>
                      <div className={styles.brandInfo}>
                        <span className={styles.brandName}>{brand.brand}</span>
                        <span className={styles.brandStats}>{brand.sales} sales ({brand.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Insurance Coverage Distribution */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div className={styles.chartTitle}>
                <Shield className={styles.chartIcon} />
                Insurance Coverage Distribution
              </div>
            </div>
            <div className={styles.chartContent}>
              <div className={styles.pieChartContainer}>
                <div className={styles.pieChart}>
                  <svg viewBox="0 0 200 200" className={styles.pieChartSvg}>
                    <circle cx="100" cy="100" r="80" fill="#8b5cf6" />
                    <circle cx="100" cy="100" r="80" fill="#10b981" 
                            strokeDasharray="175 400" strokeDashoffset="0" transform="rotate(173 100 100)" />
                    <circle cx="100" cy="100" r="80" fill="#f59e0b" 
                            strokeDasharray="100 400" strokeDashoffset="0" transform="rotate(299 100 100)" />
                    <circle cx="100" cy="100" r="40" fill="white" />
                  </svg>
                </div>
                <div className={styles.brandLegend}>
                  {insuranceCoverageData.map((coverage, index) => (
                    <div key={coverage.type} className={styles.brandItem}>
                      <div 
                        className={styles.brandColor} 
                        style={{ backgroundColor: coverage.color }}
                      ></div>
                      <div className={styles.brandInfo}>
                        <span className={styles.brandName}>{coverage.type}</span>
                        <span className={styles.brandStats}>{coverage.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportsAnalytics