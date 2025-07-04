import styles from '../layout.module.css'

export default function Footer() {
  return (
    <footer className={styles.footerWrapper}>
      <div className={styles.footerGrid}>
        <div>Products</div>
        <div>Resources</div>
        <div>Contact Us</div>
        <div>About Us</div>
      </div>
      <div className={styles.footerText}>
        For questions about the Auto Care buying service please call <span className={styles.footerLink}>1-888-878-3227</span>.<br />
        Certified Dealers are obligated by Auto Care to meet customer service standards.<br />
        Auto Care does not broker, sell, or lease motor vehicles. All vehicles shown are offered by licensed dealers.<br />
        By using this website, you agree to the Terms of Service and Privacy Policy.
      </div>
    </footer>
  )
}
