// ApplicationModal.tsx
'use client'

import React from 'react';
import styles from './ApplicationModal.module.css';// Assuming you'll reuse or create a modal-specific style here

// Define the shape of the application data based on the usage in page.tsx
interface Application {
  id: number;
  applicantName: string;
  email: string;
  phone: string;
  planName: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
  // Add any other fields you want to show in the modal (e.g., policy details, documents)
}

interface ApplicationModalProps {
  application: Application;
  onClose: () => void;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({ application, onClose }) => {
  if (!application) return null;

  return (
    // This is a basic overlay structure, you will need to style it with CSS modules
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Application Details (ID: {application.id})</h2>
          <button onClick={onClose} className={styles.closeButton}>
            &times;
          </button>
        </div>
        <div className={styles.modalBody}>
          <p><strong>Applicant:</strong> {application.applicantName}</p>
          <p><strong>Email:</strong> {application.email}</p>
          <p><strong>Phone:</strong> {application.phone}</p>
          <p><strong>Plan:</strong> {application.planName}</p>
          <p><strong>Status:</strong> <span className={styles[application.status.toLowerCase()]}>{application.status}</span></p>
          <p><strong>Submitted On:</strong> {new Date(application.submittedAt).toLocaleDateString()}</p>
          {/* Add more detailed application information here */}
        </div>
      </div>
    </div>
  );
};

export default ApplicationModal;