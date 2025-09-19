// src/lib/api.ts

// ============================================================================
//  TYPE DEFINITIONS
// ============================================================================

export type User = {
  id: number;
  email: string;
  name?: string;
  city?: string | null;
};

export type AuthResponse = {
  user: User;
  token: string;
};

export type Report = {
  id: number;
  title: string;
  description: string;
  lat?: number | null;
  lng?: number | null;
  imageUrl?: string | null;
  category: string;
  status: string;
  createdBy: number;
  createdAt: string;
  user?: {
    id: number;
    name?: string | null;
    email?: string | null;
    city?: string | null;
  };
};

// Payload types for API functions
export type RegisterPayload = { email: string; password: string; name?: string };
export type LoginPayload = { email: string; password: string };
export type CreateReportPayload = {
  title: string;
  description: string;
  category?: string;
  lat?: number | null;
  lng?: number | null;
};

// ============================================================================
//  API CONFIGURATION & CUSTOM ERROR
// ============================================================================

// Use a single canonical env var name. Set VITE_API_BASE in your frontend .env if needed.
// Default includes "/api" so callers can use paths like "/auth/login" or "/reports".
// Normalize VITE_API_BASE and ensure it ends with '/api'
const rawBase = (import.meta.env.VITE_API_BASE as string | undefined) || "http://localhost:4000/api";
export const API_BASE = rawBase.endsWith('/api') ? rawBase : rawBase.replace(/\/+$/,'') + '/api';


export class ApiError extends Error {
  status: number;
  body: any;

  constructor(message: string, status: number, body: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

// ============================================================================
//  CORE FETCH UTILITY
// ============================================================================

type CoreFetchOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | Record<string, unknown> | null;
};

/**
 * coreFetch - wrapper around fetch that:
 *  - resolves API_BASE + path
 *  - stringifies object bodies
 *  - attaches Authorization Bearer token from localStorage (key: token)
 *  - throws ApiError on non-2xx responses
 */
export async function coreFetch<T = any>(
  path: string,
  opts: CoreFetchOptions = {}
): Promise<T> {
  // Normalize path
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${API_BASE}${normalizedPath}`;

  const headers: Record<string, string> = {
    ...(opts.headers ? (opts.headers as Record<string, string>) : {}),
  };

  // If body is a plain object, stringify and set content-type
  let body: BodyInit | undefined = undefined;
  if (opts.body != null && typeof opts.body === "object" && !(opts.body instanceof FormData)) {
    body = JSON.stringify(opts.body);
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  } else if (opts.body instanceof FormData) {
    // Let fetch set the correct multipart boundary; remove content-type if present
    body = opts.body;
    delete headers["Content-Type"];
  } else {
    body = opts.body as BodyInit | undefined;
  }

  // Attach token if present
  const token = localStorage.getItem("token");
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const finalInit: RequestInit = {
    method: opts.method || (body ? "POST" : "GET"),
    ...opts,
    headers,
    body,
  };

  let res: Response;
  try {
    res = await fetch(url, finalInit);
  } catch (err: any) {
    // Network error or CORS
    throw new ApiError(err?.message ?? "Network error", 0, null);
  }

  // Try to parse body (if present) safely
  const parseJsonSafe = async () => {
    try {
      return await res.json();
    } catch {
      return null;
    }
  };

  const responseBody = await parseJsonSafe();

  if (!res.ok) {
    // Throw ApiError so callers can handle (status 401 etc.)
    const message =
      (responseBody && responseBody.message) ||
      (responseBody && responseBody.error) ||
      res.statusText ||
      "API Error";
    throw new ApiError(message, res.status, responseBody);
  }

  // If no content
  if (res.status === 204) {
    // @ts-ignore
    return null;
  }

  return responseBody as T;
}

// ============================================================================
//  EXPORTED API FUNCTIONS
// ============================================================================

/** Registers a new user. */
export function register(payload: RegisterPayload): Promise<AuthResponse> {
  return coreFetch("/auth/register", { method: "POST", body: payload });
}

/** Logs in a user. */
export function login(payload: LoginPayload): Promise<AuthResponse> {
  return coreFetch("/auth/login", { method: "POST", body: payload });
}

/** Fetches the currently authenticated user's profile. */
export function me(): Promise<{ user: User } | null> {
  return coreFetch("/me", { method: "GET" });
}

/** Fetches all reports. */
export function getReports(): Promise<Report[]> {
  return coreFetch("/reports", { method: "GET" });
}

/** Fetches a single report by its ID. */
export function getReport(id: number | string): Promise<Report> {
  return coreFetch(`/reports/${id}`, { method: "GET" });
}

/** Creates a new report. */
export function createReport(payload: CreateReportPayload): Promise<Report> {
  return coreFetch("/reports", { method: "POST", body: payload });
}

/** Updates the status of an existing report. */
export function updateReportStatus(id: number | string, status: string): Promise<Report> {
  return coreFetch(`/reports/${id}`, { method: "PATCH", body: { status } });
}
