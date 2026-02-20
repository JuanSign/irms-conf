export type TopicType =
  | 'Fundamental Rock Mechanics'
  | 'Rock Engineering Analysis & Numerical Modeling'
  | 'Rock Mechanics Applications';

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
  topic: TopicType;
  path: string;
  status: string;
  createdAt: Date;
  author?: {
    name: string;
  };
  comments?: {
    id: string;
    content: string;
    createdAt: Date;
  }[];
  coauthors?: {
    user: AuthorSearchResult;
  }[];
}