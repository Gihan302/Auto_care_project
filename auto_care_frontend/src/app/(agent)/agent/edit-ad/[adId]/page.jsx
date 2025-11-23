'use client'

import { useState, useEffect } from 'react'
import styles from '../../create-ad/page.module.css'
import api from '@/utils/axios'
import { useRouter, useParams } from 'next/navigation'

export default function EditAdPage() {
  const router = useRouter()
  const params = useParams()
  const { adId } = params

  const [formData, setFormData] = useState({
    name: '',
    t_number: '',
    email: '',
    location: '',
    title: '',
    price: '',
    v_type: '',
    manufacturer: '',
    model: '',
    v_condition: '',
    m_year: '',
    r_year: '',
    mileage: '',
    e_capacity: '',
    transmission: '',
    fuel_type: '',
    colour: '',
    description: '',
    images: [],
    flag: 0,
    lStatus: 0,
    iStatus: 0,
  })

  useEffect(() => {
    if (adId) {
      const fetchAd = async () => {
        try {
          const response = await api.get(`/advertisement/getAdById/${adId}`)
          setFormData(response.data)
        } catch (error) {
          console.error(error)
        }
      }
      fetchAd()
    }
  }, [adId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    const imagePromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    })

    Promise.all(imagePromises).then((base64Images) => {
      setFormData((prev) => ({ ...prev, images: base64Images }))
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.put(`/agent/update-ad/${adId}`, formData)
      router.push('/agent/my-ads')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Edit Advertisement</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="t_number">Telephone Number</label>
          <input type="text" id="t_number" name="t_number" value={formData.t_number} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="location">Location</label>
          <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="price">Price</label>
          <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="v_type">Vehicle Type</label>
          <input type="text" id="v_type" name="v_type" value={formData.v_type} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="manufacturer">Manufacturer</label>
          <input type="text" id="manufacturer" name="manufacturer" value={formData.manufacturer} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="model">Model</label>
          <input type="text" id="model" name="model" value={formData.model} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="v_condition">Vehicle Condition</label>
          <input type="text" id="v_condition" name="v_condition" value={formData.v_condition} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="m_year">Manufactured Year</label>
          <input type="number" id="m_year" name="m_year" value={formData.m_year} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="r_year">Registered Year</label>
          <input type="number" id="r_year" name="r_year" value={formData.r_year} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="mileage">Mileage</label>
          <input type="number" id="mileage" name="mileage" value={formData.mileage} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="e_capacity">Engine Capacity</label>
          <input type="text" id="e_capacity" name="e_capacity" value={formData.e_capacity} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="transmission">Transmission</label>
          <input type="text" id="transmission" name="transmission" value={formData.transmission} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="fuel_type">Fuel Type</label>
          <input type="text" id="fuel_type" name="fuel_type" value={formData.fuel_type} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="colour">Colour</label>
          <input type="text" id="colour" name="colour" value={formData.colour} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="images">Images</label>
          <input type="file" id="images" name="images" onChange={handleImageChange} multiple />
        </div>
        <button type="submit" className={styles.submitButton}>
          Update Advertisement
        </button>
      </form>
    </div>
  )
}
