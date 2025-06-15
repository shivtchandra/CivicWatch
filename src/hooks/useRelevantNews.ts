
import { useState, useCallback } from 'react';

interface NewsArticle {
  title: string;
  url: string;
  summary: string;
  source: string;
  published_at: string;
}

export function useRelevantNews() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Uses supabase edge function
  const fetchNews = useCallback(async (params: { title: string; location?: string; type?: string }) => {
    setLoading(true);
    setError(null);
    setNews([]);

    try {
      const res = await fetch(
        `https://xserqakwkzhwwsfwpgse.functions.supabase.co/fetch-relevant-news`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params)
        }
      );

      const data = await res.json();
      if (data.news && Array.isArray(data.news)) {
        setNews(data.news);
      } else {
        setError('No news found for this report');
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  }, []);

  return { news, loading, error, fetchNews };
}
