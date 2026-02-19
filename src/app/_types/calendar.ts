export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  htmlLink: string;
  externalUrl?: string;
  imageUrl?: string;
  hostedByUM: boolean;
}

export interface RawGoogleEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  htmlLink: string;
  start: { dateTime?: string; date?: string; timeZone?: string };
  end: { dateTime?: string; date?: string; timeZone?: string };
}

export interface GoogleCalendarResponse {
  items: CalendarEvent[];
}
