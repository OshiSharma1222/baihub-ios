// Home page type definitions

export interface HeroBanner {
  id: string;
  title: string;
  subtitle?: string; // Optional - can be empty string or undefined
  imageUrl: string;
  actionUrl?: string; // Optional - can be empty string or undefined
  actionText?: string; // Optional - can be empty string or undefined
  isActive: boolean;
  order: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  order: number;
  requiresSlotSelection?: boolean; // If false, skip time slot selection screen
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  location: string;
  user: {
    firstName: string;
    lastName: string;
    city: string;
  };
  serviceId: string;
  createdAt: string;
}

export interface SecondaryBanner {
  id: string;
  title: string;
  subtitle?: string; // Optional - can be empty string or undefined
  imageUrl: string;
  actionUrl?: string; // Optional - can be empty string or undefined
  actionText?: string; // Optional - can be empty string or undefined
  isActive: boolean;
  order: number;
}

export interface AreaServed {
  id?: string;
  name: string;
  serviceCount: number;
  isActive: boolean;
  icon?: string;
  isVisibleOnHomePage?: boolean;
  createdAt?: string;
}

export interface AreasServed {
  cities: AreaServed[];
  totalAreas: number;
}

export interface HomePageData {
  heroBanner: HeroBanner | null; // Can be null if no hero banner is configured
  quickCategories: Category[];
  featuredTestimonials: Review[];
  secondaryBanners: SecondaryBanner[];
  areasServed: AreasServed;
}

export interface AreasServedResponse {
  cities: AreaServed[];
  total: number;
  limit: number;
  offset: number;
}

export interface Area {
  id: string;
  name: string;
  pincode?: string;
  state?: string;
  country?: string;
  latitude?: string;
  longitude?: string;
  isActive: boolean;
  serviceCount?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  categories?: Category[];
}

export interface Plan {
  id: string;
  title: string;
  description?: string;
  amount?: number | null;
  price: {
    total: number;
    amount: number;
    discount: number;
  };
  isActive: boolean;
  duration?: number; // Duration in days
  isPostpaid?: boolean; // If true, only booking amount is collected at order creation
  bookingAmount?: number; // Fixed amount required at booking (takes precedence over bookingPercentage)
  bookingPercentage?: number; // Percentage of total amount required at booking (0-100)
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}








