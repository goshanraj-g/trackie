export type Job = {
  id: string;
  title: string;
  companyName: string;
  url: string;
  status?: string;
  notes?: string;
  type: "added" | "watchlist";
  date?: string;
  possibleDomains?: string[];
  logoIndex?: number;
};
