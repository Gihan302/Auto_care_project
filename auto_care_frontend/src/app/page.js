import styles from './page.module.css'

export default function HomePage() {
  return (
    <div className={styles.hero}>
      <h1 className="text-4xl font-bold text-primary">Your Dream Vehicle Awaits!</h1>
      <p className={styles.subheading}>Browse Listings Today</p>
    </div>
  )
}
