import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
}

export function useDocumentTitle({ title, description }: SEOProps): void {
  useEffect(() => {
    const previousTitle = document.title;
    const fullTitle = title ? `${title} | YatraPrasadam` : 'YatraPrasadam — Prasadam on train & food on rail in India';
    document.title = fullTitle;

    const canonicalUrl = 'https://www.yatraprasadam.in/' + window.location.pathname;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);
    }

    return () => {
      document.title = previousTitle;
    };
  }, [title, description]);
}
