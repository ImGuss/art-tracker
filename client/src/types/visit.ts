export interface Visit {
  id: number;
  user_id: number;
  museum_id: number;
  visit_date: Date;
}

export interface VisitArtwork {
  visit_id: number;
  artwork_id: number;
}

export interface AddVisitFormData {
  user_id: number;
  museum_id: number;
  visit_date: number;
}