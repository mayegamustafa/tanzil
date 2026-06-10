// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────────────────────────────────────

export interface SiteSetting {
  id: number;
  key: string;
  value: string | Record<string, unknown> | null;
  group: SettingGroup;
  type: "text" | "textarea" | "json" | "boolean" | "image" | "color" | "number";
  is_public: boolean;
  label: string;
}

export type SettingGroup =
  | "general"
  | "contacts"
  | "appearance"
  | "seo"
  | "payment_methods"
  | "social"
  | "homepage";

export interface PublicSettings {
  site_name: string;
  site_tagline: string;
  site_logo: string;
  site_favicon: string;
  contact_phone_1: string;
  contact_phone_2: string;
  contact_phone_3: string;
  contact_email: string;
  contact_address: string;
  contact_maps_embed: string;
  contact_office_hours: string;
  whatsapp_number: string;
  social_facebook: string;
  social_instagram: string;
  social_twitter: string;
  social_youtube: string;
  footer_text: string;
  color_primary: string;
  color_accent: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// PACKAGES
// ─────────────────────────────────────────────────────────────────────────────

export type PackageType = "hajj" | "umrah" | "local" | "international";
export type PackageTier = "economy" | "standard" | "vip" | "family";
export type PackageStatus = "draft" | "published" | "archived";

export interface PackagePricing {
  economy?: number;
  standard?: number;
  vip?: number;
  family?: number;
}

export interface PackageHotel {
  name: string;
  location: string;
  stars: number;
  distance_from_haram?: string;
  nights: number;
  image?: string;
}

export interface PackageFlight {
  airline: string;
  from: string;
  to: string;
  class: string;
}

export interface PackageItineraryDay {
  id: number;
  day_number: number;
  title: string;
  description: string;
  activities: string[];
}

export interface PackageInclusion {
  id: number;
  text: string;
  type: "inclusion" | "exclusion";
}

export interface Package {
  id: number;
  type: PackageType;
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  thumbnail: string;
  gallery: string[];
  pricing: PackagePricing;
  hotels: PackageHotel[];
  flights: PackageFlight[];
  departure_date: string;
  return_date: string;
  duration_days: number;
  seats_total: number;
  seats_booked: number;
  seats_available: number;
  is_featured: boolean;
  status: PackageStatus;
  itineraries: PackageItineraryDay[];
  inclusions: PackageInclusion[];
  brochure_url?: string;
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
}

export interface PackageListItem {
  id: number;
  type: PackageType;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
  pricing: PackagePricing;
  departure_date: string;
  duration_days: number;
  seats_available: number;
  is_featured: boolean;
  status: PackageStatus;
}

// ─────────────────────────────────────────────────────────────────────────────
// BOOKINGS
// ─────────────────────────────────────────────────────────────────────────────

export type BookingStatus =
  | "pending"
  | "approved"
  | "processing"
  | "paid"
  | "cancelled"
  | "completed";

export type PaymentStatus = "unpaid" | "partial" | "paid" | "refunded";

export type PaymentMethod =
  | "bank_transfer"
  | "mobile_money"
  | "card"
  | "cash"
  | "flutterwave"
  | "paypal";

export interface BookingPassenger {
  id?: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: "male" | "female";
  nationality: string;
  passport_number: string;
  passport_expiry: string;
  passport_copy?: string;
  is_lead: boolean;
}

export interface Booking {
  id: number;
  reference: string;
  package: PackageListItem;
  tier: PackageTier;
  lead_name: string;
  email: string;
  phone: string;
  num_passengers: number;
  passengers: BookingPassenger[];
  booking_status: BookingStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  payment_proof?: string;
  total_amount: number;
  currency: string;
  invoice_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface BookingFormData {
  package_id: number;
  tier: PackageTier;
  email: string;
  phone: string;
  num_passengers: number;
  passengers: BookingPassenger[];
  payment_method: PaymentMethod;
  payment_proof?: File;
  discount_code?: string;
  special_requests?: string;
}

export interface BookingStatusResponse {
  reference: string;
  lead_name: string;
  package_title: string;
  departure_date: string;
  num_passengers: number;
  booking_status: BookingStatus;
  payment_status: PaymentStatus;
  total_amount: number;
  currency: string;
  invoice_url?: string;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOG
// ─────────────────────────────────────────────────────────────────────────────

export type BlogStatus = "draft" | "published" | "archived";

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: number;
  category: BlogCategory;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  author_name: string;
  author_avatar?: string;
  status: BlogStatus;
  published_at: string;
  views: number;
  read_time_minutes: number;
  tags: string[];
  seo_title?: string;
  seo_description?: string;
  created_at: string;
}

export interface BlogPostListItem {
  id: number;
  category: BlogCategory;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
  author_name: string;
  published_at: string;
  read_time_minutes: number;
  tags: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// GALLERY
// ─────────────────────────────────────────────────────────────────────────────

export type MediaType = "image" | "video";

export interface GalleryAlbum {
  id: number;
  title: string;
  slug: string;
  cover_image: string;
  item_count: number;
}

export interface GalleryItem {
  id: number;
  album_id: number;
  type: MediaType;
  url: string;
  thumbnail?: string;
  caption?: string;
  alt?: string;
  sort_order: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────────────────────────────

export type TestimonialStatus = "pending" | "approved" | "rejected";

export interface Testimonial {
  id: number;
  name: string;
  location?: string;
  avatar?: string;
  rating: number;
  text: string;
  video_url?: string;
  package_type?: PackageType;
  status: TestimonialStatus;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQs
// ─────────────────────────────────────────────────────────────────────────────

export interface Faq {
  id: number;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// INQUIRIES
// ─────────────────────────────────────────────────────────────────────────────

export type InquiryStatus = "new" | "contacted" | "qualified" | "closed";

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone?: string;
  package_id?: number;
  package?: PackageListItem;
  message: string;
  status: InquiryStatus;
  assigned_to?: number;
  notes?: string;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// USERS & ROLES
// ─────────────────────────────────────────────────────────────────────────────

export type UserRole = "super_admin" | "admin" | "staff" | "editor" | "agent";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  is_active: boolean;
  two_factor_enabled: boolean;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS
// ─────────────────────────────────────────────────────────────────────────────

export interface DashboardStats {
  total_revenue: number;
  revenue_this_month: number;
  revenue_growth_percent: number;
  total_bookings: number;
  bookings_this_month: number;
  bookings_growth_percent: number;
  total_inquiries: number;
  new_inquiries: number;
  active_packages: number;
}

export interface RevenueChartPoint {
  month: string;
  revenue: number;
  bookings: number;
}

export interface BookingStatusBreakdown {
  status: BookingStatus;
  count: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// API RESPONSES
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface ValidationError {
  message: string;
  errors: Record<string, string[]>;
}
