import React from 'react';

// Renders `METHOD /path/{id}` as the visual anchor of a method page.
// Path placeholders keep the same curly-brace treatment used in the
// parameters table, and each verb gets its own accent colour.
export default function Endpoint({ method, path }) {
  const parts = String(path)
    .split(/(\{[^}]+\})/g)
    .filter(Boolean);

  return (
    <div className={`endpoint-line endpoint-${String(method).toLowerCase()}`}>
      <span className="endpoint-method">{method}</span>
      <code className="endpoint-path">
        {parts.map((part, index) =>
          part.startsWith('{') ? (
            <span className="endpoint-param" key={index}>
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          ),
        )}
      </code>
    </div>
  );
}
