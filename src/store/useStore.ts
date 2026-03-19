import { create } from 'zustand';

export interface Comment {
  id: string;
  authorUid: string;
  text: string;
  createdAt: Date;
}

export interface PostData {
  id: string;
  authorUid: string;
  mediaUrl: string;
  type: 'image' | 'video';
  caption: string;
  hashtags: string[];
  createdAt: Date;
  comments: Comment[];
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  messages: Message[];
}

export interface Story {
  id: string;
  userUid: string;
  mediaUrl: string;
  type: 'image' | 'video';
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  storeId: string;
  ratings: number[];
}

export interface Store {
  id: string;
  name: string;
  description: string;
  ownerUid: string;
  logoUrl: string;
}

interface AppState {
  posts: PostData[];
  stores: Store[];
  products: Product[];
  conversations: Conversation[];
  stories: Story[];
  following: string[];
  followRequests: string[];
  incomingRequests: string[];
  userSettings: Record<string, { isPrivate: boolean }>;
  userStats: Record<string, { followers: number; following: number }>;
  savedPosts: string[];
  setPosts: (posts: PostData[]) => void;
  addPost: (post: PostData) => void;
  addStore: (store: Store) => void;
  addProduct: (product: Product) => void;
  addRating: (productId: string, rating: number) => void;
  addMessage: (conversationId: string, message: Message) => void;
  createConversation: (participants: string[]) => string;
  addStory: (story: Story) => void;
  addComment: (postId: string, comment: Comment) => void;
  toggleFollow: (targetUid: string) => void;
  toggleProfileVisibility: (uid: string) => void;
  requestFollow: (targetUid: string) => void;
  approveFollow: (requesterUid: string) => void;
  rejectFollow: (requesterUid: string) => void;
  toggleSavePost: (postId: string) => void;
}

export const useStore = create<AppState>((set) => ({
  posts: [
    {
      id: '1',
      authorUid: 'nature_lover',
      mediaUrl: 'https://picsum.photos/seed/nature/600/600',
      type: 'image',
      caption: 'Beautiful nature!',
      hashtags: ['nature', 'beauty', 'outdoors'],
      createdAt: new Date(),
      comments: [
        { id: 'c1', authorUid: 'city_explorer', text: 'Wow, amazing shot!', createdAt: new Date() }
      ],
    },
    {
      id: '2',
      authorUid: 'city_explorer',
      mediaUrl: 'https://picsum.photos/seed/city/600/600',
      type: 'image',
      caption: 'City lights.',
      hashtags: ['city', 'night', 'lights'],
      createdAt: new Date(),
      comments: [],
    },
    {
      id: '3',
      authorUid: 'coffee_fan',
      mediaUrl: 'https://picsum.photos/seed/coffee/600/600',
      type: 'image',
      caption: 'Morning brew.',
      hashtags: ['coffee', 'morning'],
      createdAt: new Date(Date.now() - 3600000),
      comments: [],
    },
    {
      id: '4',
      authorUid: 'nature_lover',
      mediaUrl: 'https://picsum.photos/seed/mountain/600/600',
      type: 'image',
      caption: 'Hiking the peaks.',
      hashtags: ['hiking', 'mountains'],
      createdAt: new Date(Date.now() - 7200000),
      comments: [],
    },
    {
      id: '5',
      authorUid: 'city_explorer',
      mediaUrl: 'https://picsum.photos/seed/street/600/600',
      type: 'image',
      caption: 'Street photography.',
      hashtags: ['street', 'urban'],
      createdAt: new Date(Date.now() - 10800000),
      comments: [],
    },
    {
      id: '6',
      authorUid: 'coffee_fan',
      mediaUrl: 'https://picsum.photos/seed/latte/600/600',
      type: 'image',
      caption: 'Latte art.',
      hashtags: ['latte', 'art'],
      createdAt: new Date(Date.now() - 14400000),
      comments: [],
    },
    {
      id: '7',
      authorUid: 'nature_lover',
      mediaUrl: 'https://picsum.photos/seed/forest/600/600',
      type: 'image',
      caption: 'Deep in the woods.',
      hashtags: ['forest', 'green'],
      createdAt: new Date(Date.now() - 18000000),
      comments: [],
    },
    {
      id: '8',
      authorUid: 'city_explorer',
      mediaUrl: 'https://picsum.photos/seed/architecture/600/600',
      type: 'image',
      caption: 'Modern lines.',
      hashtags: ['architecture', 'design'],
      createdAt: new Date(Date.now() - 21600000),
      comments: [],
    },
    {
      id: '9',
      authorUid: 'coffee_fan',
      mediaUrl: 'https://picsum.photos/seed/beans/600/600',
      type: 'image',
      caption: 'Freshly roasted.',
      hashtags: ['roast', 'beans'],
      createdAt: new Date(Date.now() - 25200000),
      comments: [],
    },
    {
      id: '10',
      authorUid: 'nature_lover',
      mediaUrl: 'https://picsum.photos/seed/river/600/600',
      type: 'image',
      caption: 'Flowing water.',
      hashtags: ['river', 'peace'],
      createdAt: new Date(Date.now() - 28800000),
      comments: [],
    },
  ],
  conversations: [
    {
      id: 'c1',
      participants: ['test-user-id', 'nature_lover'],
      messages: [
        { id: 'm1', senderId: 'nature_lover', text: 'Hey! Love your latest post.', createdAt: new Date(Date.now() - 100000) },
        { id: 'm2', senderId: 'test-user-id', text: 'Thanks! Your gear is awesome too.', createdAt: new Date(Date.now() - 50000) },
      ],
      lastMessage: { id: 'm2', senderId: 'test-user-id', text: 'Thanks! Your gear is awesome too.', createdAt: new Date(Date.now() - 50000) },
    },
    {
      id: 'c2',
      participants: ['test-user-id', 'city_explorer'],
      messages: [
        { id: 'm3', senderId: 'city_explorer', text: 'Check out this new spot in the city!', createdAt: new Date(Date.now() - 200000) },
      ],
      lastMessage: { id: 'm3', senderId: 'city_explorer', text: 'Check out this new spot in the city!', createdAt: new Date(Date.now() - 200000) },
    }
  ],
  stores: [
    {
      id: 's1',
      name: 'Nature Gear',
      description: 'Everything you need for the outdoors.',
      ownerUid: 'nature_lover',
      logoUrl: 'https://picsum.photos/seed/gear/200/200',
    },
    {
      id: 's2',
      name: 'Urban Tech',
      description: 'The latest gadgets and tech for city life.',
      ownerUid: 'city_explorer',
      logoUrl: 'https://picsum.photos/seed/tech/200/200',
    },
    {
      id: 's3',
      name: 'Coffee Haven',
      description: 'Premium beans and brewing equipment.',
      ownerUid: 'coffee_fan',
      logoUrl: 'https://picsum.photos/seed/coffee/200/200',
    }
  ],
  products: [
    {
      id: 'p1',
      name: 'Hiking Boots',
      description: 'Durable boots for long trails.',
      price: 120,
      imageUrl: 'https://picsum.photos/seed/boots/400/400',
      storeId: 's1',
      ratings: [5, 4, 5],
    },
    {
      id: 'p2',
      name: 'Waterproof Jacket',
      description: 'Stay dry in any weather.',
      price: 85,
      imageUrl: 'https://picsum.photos/seed/jacket/400/400',
      storeId: 's1',
      ratings: [4, 4],
    },
    {
      id: 'p3',
      name: 'Wireless Headphones',
      description: 'Noise cancelling and high fidelity.',
      price: 199,
      imageUrl: 'https://picsum.photos/seed/headphones/400/400',
      storeId: 's2',
      ratings: [5, 5, 4],
    },
    {
      id: 'p4',
      name: 'Smart Watch',
      description: 'Track your fitness and stay connected.',
      price: 249,
      imageUrl: 'https://picsum.photos/seed/watch/400/400',
      storeId: 's2',
      ratings: [4, 5],
    },
    {
      id: 'p5',
      name: 'Espresso Machine',
      description: 'Professional grade for your home.',
      price: 599,
      imageUrl: 'https://picsum.photos/seed/espresso/400/400',
      storeId: 's3',
      ratings: [5, 5, 5],
    },
    {
      id: 'p6',
      name: 'Coffee Grinder',
      description: 'Burr grinder for the perfect grind.',
      price: 45,
      imageUrl: 'https://picsum.photos/seed/grinder/400/400',
      storeId: 's3',
      ratings: [4, 3, 4],
    }
  ],
  stories: [
    {
      id: 'st1',
      userUid: 'nature_lover',
      mediaUrl: 'https://picsum.photos/seed/st1/1080/1920',
      type: 'image',
      createdAt: new Date(),
    },
    {
      id: 'st2',
      userUid: 'city_explorer',
      mediaUrl: 'https://picsum.photos/seed/st2/1080/1920',
      type: 'image',
      createdAt: new Date(),
    }
  ],
  following: [],
  followRequests: [],
  incomingRequests: ['coffee_fan'],
  userSettings: {
    'nature_lover': { isPrivate: true },
    'city_explorer': { isPrivate: false },
    'test-user-id': { isPrivate: false },
  },
  userStats: {
    'nature_lover': { followers: 1240, following: 450 },
    'city_explorer': { followers: 890, following: 320 },
    'test-user-id': { followers: 150, following: 200 },
  },
  savedPosts: [],
  setPosts: (posts) => set({ posts }),
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  addStore: (store) => set((state) => ({ stores: [...state.stores, store] })),
  addProduct: (product) => set((state) => ({ 
    products: [...state.products, { ...product, ratings: product.ratings || [] }] 
  })),
  addRating: (productId, rating) => set((state) => ({
    products: state.products.map((p) => 
      p.id === productId ? { ...p, ratings: [...p.ratings, rating] } : p
    )
  })),
  addMessage: (conversationId, message) => set((state) => ({
    conversations: state.conversations.map((c) => 
      c.id === conversationId 
        ? { ...c, messages: [...c.messages, message], lastMessage: message } 
        : c
    )
  })),
  createConversation: (participants) => {
    const id = `c${Date.now()}`;
    set((state) => ({
      conversations: [...state.conversations, { id, participants, messages: [] }]
    }));
    return id;
  },
  addStory: (story) => set((state) => ({ stories: [story, ...state.stories] })),
  addComment: (postId, comment) => set((state) => ({
    posts: state.posts.map((post) => 
      post.id === postId ? { ...post, comments: [...post.comments, comment] } : post
    )
  })),
  toggleFollow: (targetUid) => set((state) => {
    const isFollowing = state.following.includes(targetUid);
    const newFollowing = isFollowing 
      ? state.following.filter(id => id !== targetUid)
      : [...state.following, targetUid];
    
    const currentStats = state.userStats[targetUid] || { followers: 0, following: 0 };
    const newUserStats = {
      ...state.userStats,
      [targetUid]: {
        ...currentStats,
        followers: isFollowing ? currentStats.followers - 1 : currentStats.followers + 1
      }
    };

    return {
      following: newFollowing,
      userStats: newUserStats
    };
  }),
  toggleProfileVisibility: (uid) => set((state) => ({
    userSettings: {
      ...state.userSettings,
      [uid]: { isPrivate: !state.userSettings[uid]?.isPrivate }
    }
  })),
  requestFollow: (targetUid) => set((state) => ({
    followRequests: [...state.followRequests, targetUid]
  })),
  approveFollow: (requesterUid) => set((state) => {
    const currentStats = state.userStats['test-user-id'] || { followers: 0, following: 0 };
    return {
      incomingRequests: state.incomingRequests.filter(id => id !== requesterUid),
      userStats: {
        ...state.userStats,
        'test-user-id': { ...currentStats, followers: currentStats.followers + 1 }
      }
    };
  }),
  rejectFollow: (requesterUid) => set((state) => ({
    incomingRequests: state.incomingRequests.filter(id => id !== requesterUid)
  })),
  toggleSavePost: (postId) => set((state) => ({
    savedPosts: state.savedPosts.includes(postId)
      ? state.savedPosts.filter(id => id !== postId)
      : [...state.savedPosts, postId]
  })),
}));
