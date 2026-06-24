export interface ProfileService {
  title: string;
  desc: string;
}

export interface ProfileScheduleItem {
  days: string;
  hours: string;
  closed?: boolean;
}

export interface EditableProfile {
  avatar: string;
  coverImage: string;
  name: string;
  specialty: string;
  location: string;
  experience: number;
  bio: string;
  languages: string[];
  phone: string;
  email: string;
  services: ProfileService[];
  schedule: ProfileScheduleItem[];
  galleryImages: string[];
}
