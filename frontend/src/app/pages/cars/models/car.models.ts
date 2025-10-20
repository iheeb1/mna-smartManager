export interface Car {
  id?: number;
  carId?: number;
  plateNumber: string;
  carNumber?: string;
  model: string;
  carNotes?: string; 
  isActive: boolean;
  carStatusId?: number;
  location?: string;
  objectId?: number;
  createdBy?: number;
  modifiedBy?: number;
  createdDate?: Date;
  modifiedDate?: Date;
}

export interface CarsListParams {
  objectIds?: string;
  itemsPerPage?: number;
  pageNumber?: number;
  searchTerm?: string;
  includeTotalRowsLength?: boolean;
}

export interface CarsListResult {
  totalLength: number;
  rowsList: Car[];
}