import styles from '../layout.module.css'

export default function() {
  return (
    <footer className={styles.footerWrapper}>
      <div className={styles.footerContainer}>
        <div className={styles.footerGrid}>
          <div>
            <h3 className={styles.footerTitle}>AUTO CARE</h3>
            <p className="text-gray-400">
              Your trusted partner in finding the perfect vehicle. We provide comprehensive automotive solutions with exceptional service.
            </p>
          </div>

          <div>
            <h4 className={styles.footerTitle}>Services</h4>
            <div className={styles.footerList}>
              <a href="#">Buy a Car</a>
              <a href="#">Sell Your Car</a>
              <a href="#">Financing</a>
              <a href="#">Insurance</a>
            </div>
          </div>

          <div>
            <h4 className={styles.footerTitle}>Support</h4>
            <div className={styles.footerList}>
              <a href="#">Contact Us</a>
              <a href="#">Help Center</a>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
            </div>
          </div>

          <div>
            <h4 className={styles.footerTitle}>Contact</h4>
            <div className={styles.footerContact}>
              <p>📞 +1 (555) 123-4567</p>
              <p>✉️ info@autocare.com</p>
              <p>📍 123 Auto Street, Car City, CC 12345</p>
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
