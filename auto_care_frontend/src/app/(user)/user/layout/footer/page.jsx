import styles from '../layout.module.css'

export default function Footer() {
  return (
    <footer className={styles.footerWrapper}>
      <div className={styles.footerContainer}>
        <div className={styles.footerGrid}>
          <div>
            <h3 className={styles.footerTitle}>AUTO CARE</h3>
            <p className={styles.footerDescription}>
              Your trusted partner in finding the perfect vehicle. We provide comprehensive automotive solutions with exceptional service.
            </p>
          </div>
          
          <div>
            <h4 className={styles.footerTitle}>Services</h4>
            <div className={styles.footerList}>
              <a href="/buy">Buy a Car</a>
              <a href="/sell">Sell Your Car</a>
              <a href="/financing">Financing</a>
              <a href="/insurance">Insurance</a>
            </div>
          </div>
          
          <div>
            <h4 className={styles.footerTitle}>Support</h4>
            <div className={styles.footerList}>
              <a href="/contact">Contact Us</a>
              <a href="/help">Help Center</a>
              <a href="/about">About Us</a>
              <a href="/careers">Careers</a>
            </div>
          </div>
          
          <div>
            <h4 className={styles.footerTitle}>Contact</h4>
            <div className={styles.footerContact}>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📞</span>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>✉️</span>
                <span>info@autocare.com</span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📍</span>
                <span>123 Auto Street, Car City, CC 12345</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p>&copy; 2024 Auto Care. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}