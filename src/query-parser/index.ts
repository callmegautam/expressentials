export interface SortField {
  field: string;
  order: "asc" | "desc";
}

export interface Pagination {
  page: number;
  limit: number;
}

export interface ParseQueryResult {
  sort?: SortField[];
  filter?: Record<string, unknown>;
  pagination: Pagination;
}

export interface ParseQueryOptions {
  defaultLimit?: number;
  maxLimit?: number;
}

function parseSort(raw: unknown): SortField[] | undefined {
  if (typeof raw !== "string" || raw.length === 0) return undefined;

  return raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry): SortField | null => {
      if (entry.startsWith("-")) {
        const field = entry.slice(1).trim();
        if (!field) return null;
        return { field, order: "desc" };
      }
      return { field: entry, order: "asc" };
    })
    .filter((x): x is SortField => x !== null);
}

function parsePagination(
  pageRaw: unknown,
  limitRaw: unknown,
  options: Required<ParseQueryOptions>,
): Pagination {
  const page = typeof pageRaw === "string" ? Math.max(1, parseInt(pageRaw, 10) || 1) : 1;
  const parsedLimit =
    typeof limitRaw === "string" && /^\d+$/.test(limitRaw.trim())
      ? Number(limitRaw.trim())
      : Number.NaN;

  let limit =
    typeof limitRaw === "string" && !Number.isNaN(parsedLimit)
      ? Math.max(1, parsedLimit)
      : options.defaultLimit;
  if (limit > options.maxLimit) limit = options.maxLimit;
  return { page, limit };
}

export function parseQuery(
  query: Record<string, unknown>,
  options: ParseQueryOptions = {},
): ParseQueryResult {
  const opts: Required<ParseQueryOptions> = {
    defaultLimit: options.defaultLimit ?? 20,
    maxLimit: options.maxLimit ?? 100,
  };

  return {
    sort: parseSort(query.sort),
    filter:
      typeof query.filter === "object" && query.filter !== null
        ? (query.filter as Record<string, unknown>)
        : undefined,
    pagination: parsePagination(query.page, query.limit, opts),
  };
}
