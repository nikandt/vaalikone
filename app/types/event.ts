export interface Event {
    creator_uid: string;
    date: Date;
    description: string;
    host: string;
    location: {
      coordinates: {
        latitude: number;
        longitude: number;
      };
      description: string;
    };
    title: string;
    playlist: string;
    guests: [{}];
  }
  