"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/axios';
import styles from '../../(insurance)/Insurance/managePlans/managePlans.module.css'; // Reusing styles

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/lcompany/users");
        const usersData = Array.isArray(response.data) ? response.data : [];
        setUsers(usersData);
      } catch (err) {
        setError("Failed to fetch users. Are you logged in?");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleMessageUser = async (userId) => {
    try {
      const response = await api.post('/company/messages/conversations', {
        userId: userId,
        message: 'Hello, I would like to discuss your leasing plan.'
      });
      const conversationId = response.data.conversationId;
      router.push(`/leasing/message?conversationId=${conversationId}`);
    } catch (error) {
      console.error('Error creating conversation:', error);
      setError('Failed to start conversation.');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Manage Users</h1>
      <p>Users who have applied for your leasing plans.</p>

      <div className={styles.tableWrapper}>
        <h2>Users</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className={styles.loading}>Loading users...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="3" className={styles.error}>{error}</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="3" className={styles.empty}>No users found.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.fname} {user.lname}</td>
                  <td>{user.username}</td>
                  <td>
                    <button
                      className={styles.button}
                      onClick={() => handleMessageUser(user.id)}
                    >
                      Message
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsersPage;
