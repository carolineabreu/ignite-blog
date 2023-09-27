import Link from 'next/link';
import commonStyle from '../../styles/common.module.scss';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <div className={`${commonStyle.container} ${styles.header}`}>
      <Link href="/">
        <img src="/Logo.svg" alt="logo" />
      </Link>
    </div>
  );
}
