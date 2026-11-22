import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

export type Topic = {
  title: string;
  to: string;
  image: string;
};

/**
 * Compact cards for the API reference index. Same banner art as the section
 * cards, scaled down, with only the topic name under it so the eight About API
 * pages do not push the resource tables below the fold.
 */
export default function TopicCards({topics}: {topics: Topic[]}): ReactNode {
  const {withBaseUrl} = useBaseUrlUtils();

  return (
    <div className={styles.grid}>
      {topics.map((topic) => (
        <Link key={topic.to} className={styles.card} to={topic.to}>
          <img
            className={styles.image}
            src={withBaseUrl(topic.image)}
            alt=""
            loading="lazy"
          />
          <span className={styles.title}>{topic.title}</span>
        </Link>
      ))}
    </div>
  );
}
