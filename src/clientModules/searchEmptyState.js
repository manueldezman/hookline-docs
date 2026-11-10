/**
 * Adds a next step to the search plugin's empty state. The plugin renders
 * its dropdown template as a string, so there is no component to override.
 * This module appends a hint line, and a link that respects the base URL,
 * to any no-results block the dropdown creates.
 */
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import site from '@site/site.json';

const BASE_URL = `/${site.repo}/`;

function upgradeEmptyStates() {
  for (const node of document.querySelectorAll('[class*="noResults_"]')) {
    if (node.dataset.hintAdded === 'true') continue;
    node.dataset.hintAdded = 'true';

    const hint = document.createElement('span');
    hint.className = 'searchEmptyHint';
    hint.innerHTML =
      `Try a shorter query or a different word, or start from ` +
      `<a href="${BASE_URL}docs/">Getting started</a>.`;
    node.appendChild(hint);
  }
}

if (ExecutionEnvironment.canUseDOM) {
  const start = () => {
    upgradeEmptyStates();
    new MutationObserver(upgradeEmptyStates).observe(document.body, {
      childList: true,
      subtree: true,
    });
  };

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
}
