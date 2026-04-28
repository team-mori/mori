export type Category = "scholarship" | "extracurricular" | "career";
export type AppStatus = "planning" | "completed";

export type Notice = {
  id: string;
  category: Category;
  title: string;
  summary: string | null;
  target: string | null;
  start_date: string | null;
  end_date: string | null;
  documents: string[];
  source_url: string;
  source_board: string | null;
  raw_html: string | null;
  llm_processed: boolean;
  created_at: string;
};

export type ApplicationStatusRow = {
  id: string;
  user_id: string;
  notice_id: string;
  status: AppStatus;
  updated_at: string;
};
