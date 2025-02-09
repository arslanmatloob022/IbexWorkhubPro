export interface contactPerson {
  firstName: string;
  lastName: string;
  displayName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  cellPhone: string;
  loginAllowed: boolean;
}

export interface leadData {
  id: string;
  title: string;
  address: string;
  current_state: string;
  city: string;
  state: string;
  status: string;
  is_active: boolean;
  wifiAvaliabe: boolean;
  parkingAvaliable: boolean;
  property_features: boolean;
  zip_code: string;
  confidence: number;
  sale_date: string;
  sales_people: [];
  tags: [];
  estimated_from: string;
  estimated_to: string;
  sources: string;
  project_type: string;
  notes: string;
  attachments: [];
  attach_mail: string;
  created_by: string;
  startDate: string;
  endDate: string;
  description: string;
  image: string;
  color: string;
  managers: [];
  client: string;
  leadStatus: string;
  contractor: string;
  latitude: number;
  longitude: number;
}
