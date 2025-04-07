export interface Department {
  _id: string;
  name: string;
}

export interface Employee {
  _id?: string;
  name: string;
  email: string;
  position: string;
  departmentId: string;
  joinDate: string;
}
