import Link from 'next/link';
import styles from '../styles/Sidebar.module.scss';
import logo from '../assets/generic.png';

const Sidebar: React.FC = () => (
  <div className={styles.sidebar}>
    <div className={styles.logo}>
      <img src={logo.src} />
    </div>
    <nav className={styles.navLinks}>
      <Link href="/" className={styles.navLink}>
        <i className="fas fa-home"></i> Home
      </Link>
      <Link href="/users" className={styles.navLink}>
        <i className="fas fa-users"></i> Users
      </Link>
      <Link href="/settings" className={styles.navLink}>
        <i className="fas fa-cog"></i> Settings
      </Link>
    </nav>
    <footer className={styles.footer}>
      <p>© 2024 Tessa Nikander</p>
    </footer>
  </div>
);

export default Sidebar;
