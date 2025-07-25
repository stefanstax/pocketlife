export interface CategoryType extends AddCategoryType {
  id: string;
}

export interface AddCategoryType {
  name: string;
  icon: string;
  user_id: string;
}

export interface EditCategoryType {
  id: string;
  name: string;
  icon: string;
}
