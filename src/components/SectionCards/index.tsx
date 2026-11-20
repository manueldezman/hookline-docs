import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

type SectionCardProps = {
  title: string;
  description: string;
  image: string;
  to: string;
  wholeCard?: boolean;
  children?: ReactNode;
};

export function SectionCard({title, description, image, to, wholeCard = false, children}: SectionCardProps) {
  const src = useBaseUrl(image);

  const titleContent = (
    <>
      <span className={styles.title}>{title}</span>
      <span className={styles.arrow} aria-hidden="true" />
    </>
  );

  const body = (
    <div className={styles.body}>
      {wholeCard ? (
        <div className={styles.heading}>{titleContent}</div>
      ) : (
        <Link className={styles.heading} to={to}>
          {titleContent}
        </Link>
      )}
      <p className={styles.description}>{description}</p>
      {children ? <div className={styles.links}>{children}</div> : null}
    </div>
  );

  const inner = (
    <>
      <img className={styles.image} src={src} alt="" loading="lazy" />
      {body}
    </>
  );

  if (wholeCard) {
    return (
      <Link className={styles.card} to={to}>
        {inner}
      </Link>
    );
  }

  return <article className={styles.card}>{inner}</article>;
}

export default function SectionCards({children, className}: {children: ReactNode; className?: string}) {
  const classes = [styles.grid, className].filter(Boolean).join(' ');
  return <div className={classes}>{children}</div>;
}
