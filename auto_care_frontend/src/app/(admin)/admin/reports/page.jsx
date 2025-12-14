'use client'
import { useState, useEffect } from "react"
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
  Loader2,
  AlertCircle
} from "lucide-react"

const API_BASE_URL = 'http://localhost:8080/api/admin/analytics'

const ReportsAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [debugInfo, setDebugInfo] = useState([])
  
  const [overviewData, setOverviewData] = useState(null)
  const [manufacturerData, setManufacturerData] = useState([])
  const [timeSeriesData, setTimeSeriesData] = useState([])
  const [vehicleTypeData, setVehicleTypeData] = useState([])
  const [statusData, setStatusData] = useState(null)

  useEffect(() => {
    fetchAllAnalytics()
  }, [selectedPeriod])

  const addDebug = (message) => {
    console.log(message)
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const fetchAllAnalytics = async () => {
    setLoading(true)
    setError(null)
    setDebugInfo([])
    
    try {
      addDebug(`Starting fetch with period: ${selectedPeriod}`)
      
      // Get auth token - check multiple possible storage keys
      const token = localStorage.getItem('token') || 
                   localStorage.getItem('authToken') || 
                   localStorage.getItem('accessToken') ||
                   sessionStorage.getItem('token')
      
      if (!token) {
        addDebug('⚠️ No authentication token found!')
        throw new Error('Not authenticated. Please log in as admin first.')
      }
      
      addDebug(`✅ Token found: ${token.substring(0, 20)}...`)
      
      const endpoints = [
        { name: 'overview', url: `${API_BASE_URL}/overview?period=${selectedPeriod}` },
        { name: 'manufacturers', url: `${API_BASE_URL}/manufacturers?period=${selectedPeriod}` },
        { name: 'timeseries', url: `${API_BASE_URL}/timeseries?period=${selectedPeriod}` },
        { name: 'vehicle-types', url: `${API_BASE_URL}/vehicle-types?period=${selectedPeriod}` },
        { name: 'status', url: `${API_BASE_URL}/status?period=${selectedPeriod}` }
      ]

      const results = await Promise.allSettled(
        endpoints.map(async endpoint => {
          addDebug(`Fetching ${endpoint.name}...`)
          
          const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
          
          const response = await fetch(endpoint.url, { 
            headers,
            credentials: 'include'
          })
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }
          
          const data = await response.json()
          addDebug(`${endpoint.name} received: ${JSON.stringify(data).substring(0, 100)}...`)
          return { name: endpoint.name, data }
        })
      )

      results.forEach((result, index) => {
        const endpoint = endpoints[index]
        if (result.status === 'fulfilled') {
          const { name, data } = result.value
          
          switch(name) {
            case 'overview':
              setOverviewData(data)
              break
            case 'manufacturers':
              setManufacturerData(Array.isArray(data) ? data : [])
              break
            case 'timeseries':
              setTimeSeriesData(Array.isArray(data) ? data : [])
              break
            case 'vehicle-types':
              setVehicleTypeData(Array.isArray(data) ? data : [])
              break
            case 'status':
              setStatusData(data)
              break
          }
        } else {
          addDebug(`${endpoint.name} failed: ${result.reason.message}`)
          console.error(`${endpoint.name} error:`, result.reason)
        }
      })

      const failedCount = results.filter(r => r.status === 'rejected').length
      if (failedCount === results.length) {
        throw new Error('All API calls failed. Check if backend is running on port 8080')
      }

    } catch (err) {
      setError(err.message)
      addDebug(`Critical error: ${err.message}`)
      console.error('Analytics fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    alert('Export feature coming soon!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 text-red-500 mb-4">
            <AlertCircle className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Connection Error</h2>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          
          <div className="bg-gray-50 rounded p-4 mb-4">
            <h3 className="font-semibold mb-2">Debug Information:</h3>
            <div className="text-sm text-gray-600 space-y-1 max-h-60 overflow-y-auto">
              {debugInfo.map((info, i) => (
                <div key={i} className="font-mono text-xs">{info}</div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
            <h3 className="font-semibold text-blue-800 mb-2">Troubleshooting:</h3>
            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
              <li>Make sure your Spring Boot backend is running on port 8080</li>
              <li>Check if CORS is properly configured</li>
              <li>Verify the database has data</li>
              <li>Check browser console for more details</li>
            </ul>
          </div>

          <button 
            onClick={fetchAllAnalytics}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-2">Real-time performance metrics from your platform</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white border rounded-lg px-4 py-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <select 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border-none bg-transparent text-sm font-medium outline-none"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <button 
              onClick={handleExport}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {overviewData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              label="Total Revenue"
              value={`$${(overviewData.totalValue / 1000000).toFixed(2)}M`}
              change={overviewData.monthlyGrowthRate}
              icon={<DollarSign />}
            />
            <StatCard
              label="Total Listings"
              value={overviewData.totalListings}
              subtitle={`${overviewData.approvedListings} Approved`}
              icon={<FileText />}
            />
            <StatCard
              label="Pending Approvals"
              value={overviewData.pendingApprovals}
              subtitle="Needs Review"
              icon={<Car />}
              warning
            />
            <StatCard
              label="With Insurance"
              value={overviewData.vehiclesWithInsurance}
              subtitle={`${overviewData.vehiclesWithLeasing} With Leasing`}
              icon={<Shield />}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Vehicle Sales by Manufacturer" icon={<PieChart />}>
            {manufacturerData.length > 0 ? (
              <ManufacturerPieChart data={manufacturerData.slice(0, 5)} />
            ) : (
              <EmptyState message="No manufacturer data available" />
            )}
          </ChartCard>

          <ChartCard title="Listing Trends Over Time" icon={<Activity />}>
            {timeSeriesData.length > 0 ? (
              <TimeSeriesChart data={timeSeriesData} />
            ) : (
              <EmptyState message="No time series data available" />
            )}
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Vehicle Type Distribution" icon={<BarChart3 />}>
            {vehicleTypeData.length > 0 ? (
              <VehicleTypeBarChart data={vehicleTypeData} />
            ) : (
              <EmptyState message="No vehicle type data available" />
            )}
          </ChartCard>

          <ChartCard title="Leasing & Insurance Status" icon={<Shield />}>
            {statusData ? (
              <StatusMetricsDisplay data={statusData} />
            ) : (
              <EmptyState message="No status data available" />
            )}
          </ChartCard>
        </div>
      </div>
    </div>
  )
}

const StatCard = ({ label, value, change, subtitle, icon, warning }) => (
  <div className="bg-white rounded-xl p-6 border hover:shadow-lg transition">
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <div className="text-gray-400">{icon}</div>
    </div>
    <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
    {change !== undefined ? (
      <div className="flex items-center gap-1">
        {change >= 0 ? (
          <>
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-500">+{change.toFixed(1)}%</span>
          </>
        ) : (
          <>
            <TrendingDown className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-red-500">{change.toFixed(1)}%</span>
          </>
        )}
      </div>
    ) : subtitle ? (
      <span className={`text-sm ${warning ? 'text-orange-600' : 'text-gray-600'}`}>{subtitle}</span>
    ) : null}
  </div>
)

const ChartCard = ({ title, icon, children }) => (
  <div className="bg-white rounded-xl p-6 border">
    <div className="flex items-center gap-2 mb-6">
      <div className="text-gray-600">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    <div className="h-80">{children}</div>
  </div>
)

const EmptyState = ({ message }) => (
  <div className="h-full flex items-center justify-center text-gray-400">
    <div className="text-center">
      <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
      <p>{message}</p>
    </div>
  </div>
)

const ManufacturerPieChart = ({ data }) => {
  const colors = ['#ef4444', '#84cc16', '#10b981', '#3b82f6', '#8b5cf6']
  
  return (
    <div className="flex items-center gap-8 h-full">
      <svg viewBox="0 0 200 200" className="w-48 h-48 flex-shrink-0">
        {data.map((item, index) => {
          const percentage = item.percentage || 0
          const startAngle = data.slice(0, index).reduce((sum, d) => sum + ((d.percentage || 0) * 3.6), 0)
          const angle = percentage * 3.6
          
          return (
            <g key={item.manufacturer || index}>
              <circle 
                cx="100" 
                cy="100" 
                r="80" 
                fill={colors[index % colors.length]}
                strokeWidth="20" 
                stroke="white" 
                strokeDasharray={`${angle * 1.4} 502`}
                strokeDashoffset={`${-startAngle * 1.4}`}
                transform="rotate(-90 100 100)"
              />
            </g>
          )
        })}
        <circle cx="100" cy="100" r="40" fill="white" />
      </svg>
      <div className="flex-1 space-y-4">
        {data.map((item, index) => (
          <div key={item.manufacturer || index} className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded flex-shrink-0"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">{item.manufacturer || 'Unknown'}</div>
              <div className="text-sm text-gray-600">
                {item.count || 0} vehicles ({(item.percentage || 0).toFixed(1)}%)
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const TimeSeriesChart = ({ data }) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.newListings || 0, d.approvedListings || 0, d.pendingListings || 0)))
  
  if (maxValue === 0) return <EmptyState message="No data to display" />
  
  return (
    <div className="h-full flex flex-col">
      <svg viewBox="0 0 400 200" className="flex-1">
        {[0, 25, 50, 75, 100].map(y => (
          <line key={y} x1="40" y1={160 - (y * 1.2)} x2="360" y2={160 - (y * 1.2)} stroke="#f3f4f6" strokeWidth="1"/>
        ))}
        
        <polyline fill="none" stroke="#10b981" strokeWidth="3"
          points={data.map((d, i) => `${60 + i * (300 / (data.length - 1))},${160 - ((d.approvedListings || 0) / maxValue * 120)}`).join(' ')}
        />
        <polyline fill="none" stroke="#f59e0b" strokeWidth="3"
          points={data.map((d, i) => `${60 + i * (300 / (data.length - 1))},${160 - ((d.pendingListings || 0) / maxValue * 120)}`).join(' ')}
        />
        <polyline fill="none" stroke="#3b82f6" strokeWidth="3"
          points={data.map((d, i) => `${60 + i * (300 / (data.length - 1))},${160 - ((d.newListings || 0) / maxValue * 120)}`).join(' ')}
        />
        
        {data.map((d, i) => (
          <text key={d.period || i} x={60 + i * (300 / (data.length - 1))} y="180" textAnchor="middle" fontSize="12" fill="#6b7280">
            {d.period ? d.period.substring(5) : ''}
          </text>
        ))}
      </svg>
      
      <div className="flex gap-4 mt-4 pt-4 border-t">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-blue-500"/><span className="text-sm">New Listings</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-green-500"/><span className="text-sm">Approved</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-amber-500"/><span className="text-sm">Pending</span></div>
      </div>
    </div>
  )
}

const VehicleTypeBarChart = ({ data }) => {
  const maxCount = Math.max(...data.map(d => d.count || 0))
  if (maxCount === 0) return <EmptyState message="No data to display" />
  
  return (
    <div className="h-full flex items-end gap-4 pb-8">
      {data.map((item) => (
        <div key={item.vehicleType} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full flex flex-col items-center justify-end h-64">
            <div className="text-sm font-semibold text-gray-900 mb-1">{item.count}</div>
            <div 
              className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
              style={{ height: `${(item.count / maxCount) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-600 text-center">{item.vehicleType}</span>
        </div>
      ))}
    </div>
  )
}

const StatusMetricsDisplay = ({ data }) => {
  const withLeasingOnly = (data.withLeasing || 0) - (data.withBoth || 0)
  const withInsuranceOnly = (data.withInsurance || 0) - (data.withBoth || 0)
  const total = withLeasingOnly + withInsuranceOnly + (data.withBoth || 0) + (data.withNeither || 0)
  
  if (total === 0) return <EmptyState message="No data to display" />
  
  const metrics = [
    { label: 'With Leasing Only', value: withLeasingOnly, color: '#3b82f6' },
    { label: 'With Insurance Only', value: withInsuranceOnly, color: '#10b981' },
    { label: 'With Both', value: data.withBoth || 0, color: '#8b5cf6' },
    { label: 'With Neither', value: data.withNeither || 0, color: '#ef4444' }
  ]
  
  return (
    <div className="h-full flex flex-col justify-center space-y-6">
      {metrics.map((metric) => (
        <div key={metric.label} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: metric.color }} />
              <span className="font-medium">{metric.label}</span>
            </div>
            <span className="font-semibold">{metric.value}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all"
              style={{ 
                width: `${(metric.value / total) * 100}%`,
                backgroundColor: metric.color
              }}
            />
          </div>
          <div className="text-right text-xs text-gray-500">
            {((metric.value / total) * 100).toFixed(1)}%
          </div>
        </div>
      ))}
    </div>
  )
}

export default ReportsAnalytics