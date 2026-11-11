import type {ReactNode} from 'react';
import {Redirect} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';

/**
 * The docs folder owns every page, so the site root only forwards there.
 * This stays a route rather than a static redirect because the theme links
 * to the home page itself, from the navbar logo to the 404 page.
 */
export default function Home(): ReactNode {
  return <Redirect to={useBaseUrl('/docs/')} />;
}
