import styles from './page.module.css'

export default function ApplicationModal({ application, onClose }) {
  if (!application) {
    return null
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Application Details</h2>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>
        <div className={styles.modalBody}>
          <p><strong>Application ID:</strong> {application.id}</p>
          <p><strong>Applicant Name:</strong> {application.fullName}</p>
          <p><strong>Email:</strong> {application.email}</p>
          <p><strong>Phone:</strong> {application.phone}</p>
          <p><strong>Address:</strong> {application.address}</p>
          <p><strong>Income:</strong> {application.income}</p>
          <p><strong>Employment Status:</strong> {application.employmentStatus}</p>
          <p><strong>Credit Score:</strong> {application.creditScore}</p>
          <p><strong>Application Type:</strong> {application.applicationType}</p>
          <p><strong>Vehicle:</strong> {application.adTitle}</p>
          <p><strong>Status:</strong> {application.status}</p>
          <p><strong>Submitted At:</strong> {new Date(application.submittedAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}
