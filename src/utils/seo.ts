import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
}

export function useDocumentTitle({ title, description }: SEOProps): void {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} | YatraPrasadam` : 'YatraPrasadam — Prasadam along your journey';

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
