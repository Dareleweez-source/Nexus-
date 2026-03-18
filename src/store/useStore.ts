import { create } from 'zustand';

export interface PostData {
  id: string;
  authorUid: string;
  imageUrl: string;
  caption: string;
  createdAt: Date;
}

interface AppState {
  posts: PostData[];
  setPosts: (posts: PostData[]) => void;
  addPost: (post: PostData) => void;
}

export const useStore = create<AppState>((set) => ({
  posts: [
    {
      id: '1',
      authorUid: 'nature_lover',
      imageUrl: 'https://picsum.photos/seed/nature/600/600',
      caption: 'Beautiful nature!',
      createdAt: new Date(),
    },
    {
      id: '2',
      authorUid: 'city_explorer',
      imageUrl: 'https://picsum.photos/seed/city/600/600',
      caption: 'City lights.',
      createdAt: new Date(),
    },
  ],
  setPosts: (posts) => set({ posts }),
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
}));
