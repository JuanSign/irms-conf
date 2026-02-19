// Type for the Search Results & Co-Authors
export interface AuthorSearchResult {
  id: string;
  name: string;
  email: string;
  affiliation: string | null;
}

// Type for the Abstract from the Database
export interface AbstractSubmission {
  id: string;
  writerId: string;
  title: string;
  topic: string;
  path: string;
  status: string;
  createdAt: Date;
  comments?: {
    id: string;
    content: string;
    createdAt: Date;
  }[];
}