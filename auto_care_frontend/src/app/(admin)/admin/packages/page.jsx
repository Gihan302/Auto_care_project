"use client"
import React, { useState } from 'react';
import axios from '../../../../utils/axios';
import { getToken } from '../../../../utils/useLocalStorage';
import styles from './packages.module.css';

const OfferPackagesPage = () => {
    const [formData, setFormData] = useState({
        packageName: '',
        price: '',
        maxAd: '',
        creationDate: '',
        endingDate: '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const token = getToken();
            await axios.post('/packages/addpackage', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSuccess('Package created successfully!');
            setFormData({
                packageName: '',
                price: '',
                maxAd: '',
                creationDate: '',
                endingDate: '',
            });
        } catch (err) {
            setError('Failed to create package. Please check the details and try again.');
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Offer a New Package</h1>
            <div className={styles.formWrapper}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="packageName">Package Name</label>
                        <input
                            type="text"
                            id="packageName"
                            name="packageName"
                            value={formData.packageName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="price">Price</label>
                        <input
                            type="text"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="maxAd">Max Ads</label>
                        <input
                            type="number"
                            id="maxAd"
                            name="maxAd"
                            value={formData.maxAd}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="creationDate">Creation Date</label>
                        <input
                            type="date"
                            id="creationDate"
                            name="creationDate"
                            value={formData.creationDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="endingDate">Ending Date</label>
                        <input
                            type="date"
                            id="endingDate"
                            name="endingDate"
                            value={formData.endingDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {error && <p className={styles.error}>{error}</p>}
                    {success && <p className={styles.success}>{success}</p>}

                    <button type="submit" className={styles.submitButton}>
                        Create Package
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OfferPackagesPage;
