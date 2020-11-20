export interface Order {
  title: string;
  address: {
    city: string;
    country: string;
    street: string;
    zip: string;
  };
  bookingDate: number;
  customer: {
    email: string;
    name: string;
    phone: string;
  };
  uid: string;
}
