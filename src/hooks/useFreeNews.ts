
import { useState, useCallback } from "react";

export interface FreeNewsArticle {
  title: string;
  url: string;
  description: string;
  source: { name: string };
  publishedAt: string;
  urlToImage?: string;
}

export function useFreeNews() {
  const [news, setNews] = useState<FreeNewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get the NewsAPI key from localStorage
  const getApiKey = () =>
    localStorage.getItem("newsapi_key") || "";

  const fetchNews = useCallback(
    async ({
      title,
      location,
      type,
    }: {
      title: string;
      location?: string;
      type?: string;
    }) => {
      setLoading(true);
      setError(null);
      setNews([]);

      const apiKey = getApiKey();
      if (!apiKey) {
        setError("Please enter your NewsAPI.org API key.");
        setLoading(false);
        return;
      }

      // Build the query
      const queryParts = [title];
      if (location) queryParts.push(location);
      if (type) queryParts.push(type);
      const q = queryParts.join(" ");
      const endpoint = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&language=en&sortBy=publishedAt&pageSize=6&apiKey=${apiKey}`;

      try {
        const res = await fetch(endpoint);
        const data = await res.json();
        if (data.status === "ok" && data.articles.length) {
          setNews(data.articles);
        } else if (data.status === "error") {
          setError(data.message || "NewsAPI: Error fetching news.");
        } else {
          setError("No news found for this report.");
        }
      } catch (e: any) {
        setError(e?.message || "Failed to fetch news.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const saveApiKey = (apiKey: string) => {
    localStorage.setItem("newsapi_key", apiKey);
  };

  return {
    news,
    loading,
    error,
    fetchNews,
    saveApiKey,
    hasApiKey: !!getApiKey(),
  };
}
