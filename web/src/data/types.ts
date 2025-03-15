export interface Creator {
    name: string;
    instagram: string;
    image: string;
    category: 'trending' | 'top';
    isVip?: boolean;
  }
  
  export interface GeneratedKey {
    key: string;
    guildId: string;
    createdAt: string;
    used: boolean;
  }