import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

type SectionCardProps = {
  title: string;
  description: string;
  image: string;
  to: string;
  children?: ReactNode;
};

export function SectionCard({title, description, image, to, children}: SectionCardProps) {
  const src = useBaseUrl(image);

  return (
    <article className={styles.card}>
      <img className={styles.image} src={src} alt="" loading="lazy" />
      <div className={styles.body}>
        <Link className={styles.heading} to={to}>
          <span className={styles.title}>{title}</span>
          <span className={styles.arrow} aria-hidden="true" />
        </Link>
        <p className={styles.description}>{description}</p>
        {children ? <div className={styles.links}>{children}</div> : null}
      </div>
    </article>
  );
}

export default function SectionCards({children, className}: {children: ReactNode; className?: string}) {
  const classes = [styles.grid, className].filter(Boolean).join(' ');
  return <div className={classes}>{children}</div>;
}
