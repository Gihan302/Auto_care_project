'use client'

import { useState, useEffect } from 'react'
import styles from './page.module.css'
import { Edit, Trash2, CheckCircle, FileText } from 'lucide-react'
import api from '@/utils/axios'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function MyAdsPage() {
  const router = useRouter()
  const [ads, setAds] = useState([])

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await api.get('/agent/getad')
        setAds(response.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchAds()
  }, [])

  const handleDelete = async (adId) => {
    try {
      await api.delete(`/agent/delete-ad/${adId}`)
      setAds(ads.filter((ad) => ad.id !== adId))
    } catch (error) {
      console.error(error)
    }
  }

  const handleMarkAsSold = async (adId) => {
    try {
      await api.put(`/agent/mark-as-sold/${adId}`)
      setAds(
        ads.map((ad) =>
          ad.id === adId ? { ...ad, flag: 2 } : ad
        )
      )
    } catch (error) {
      console.error(error)
    }
  }

  const handleEdit = (adId) => {
    router.push(`/agent/edit-ad/${adId}`)
  }

  const getStatus = (flag) => {
    switch (flag) {
      case 0:
        return 'Pending'
      case 1:
        return 'Available'
      case 2:
        return 'Sold'
      default:
        return 'Unknown'
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Advertisements</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ads.map((ad) => (
            <tr key={ad.id}>
              <td>{ad.title}</td>
              <td>
                <span
                  className={`${styles.status} ${
                    styles[getStatus(ad.flag).toLowerCase()]
                  }`}
                >
                  {getStatus(ad.flag)}
                </span>
              </td>
              <td>{ad.price}</td>
              <td className={styles.actions}>
                <button
                  className={styles.actionButton}
                  onClick={() => handleEdit(ad.id)}
                >
                  <Edit size={16} />
                </button>
                <button
                  className={styles.actionButton}
                  onClick={() => handleDelete(ad.id)}
                >
                  <Trash2 size={16} />
                </button>
                {ad.flag === 1 && (
                  <>
                    <button
                      className={styles.actionButton}
                      onClick={() => handleMarkAsSold(ad.id)}
                    >
                      <CheckCircle size={16} />
                    </button>
                    <Link href={`/user/carAdd/${ad.id}`} className={styles.actionButton}>
                      <FileText size={16} />
                    </Link>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
