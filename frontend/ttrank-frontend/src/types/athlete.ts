export interface Athlete {
  id?: number;
  full_name: string;
  birth_date: string;
  phone_number: string;
  ranking_points: number;
  club?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AthleteFormData extends Omit<Athlete, 'id' | 'created_at' | 'updated_at'> {}

export interface CSVImportResult {
  message: string;
  created_athletes: string[];
  errors: string[];
  total_processed: number;
  successful: number;
  failed: number;
}