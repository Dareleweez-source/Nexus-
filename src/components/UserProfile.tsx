import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import Post from './Post';
import ProfileSuggestions from './ProfileSuggestions';
import { MessageSquare, UserPlus, UserCheck, Lock, Settings, Check, X, Clock } from 'lucide-react';

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const allPosts = useStore((state) => state.posts);
  const conversations = useStore((state) => state.conversations);
  const createConversation = useStore((state) => state.createConversation);
  const following = useStore((state) => state.following);
  const followRequests = useStore((state) => state.followRequests);
  const incomingRequests = useStore((state) => state.incomingRequests);
  const userSettings = useStore((state) => state.userSettings);
  const userStats = useStore((state) => state.userStats);
  const toggleFollow = useStore((state) => state.toggleFollow);
  const requestFollow = useStore((state) => state.requestFollow);
  const approveFollow = useStore((state) => state.approveFollow);
  const rejectFollow = useStore((state) => state.rejectFollow);
  const toggleProfileVisibility = useStore((state) => state.toggleProfileVisibility);
  
  const [user, setUser] = useState<{ displayName: string; photoURL?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const currentUserId = 'test-user-id';
  const isFollowing = userId ? following.includes(userId) : false;
  const hasRequested = userId ? followRequests.includes(userId) : false;
  const stats = userId ? userStats[userId] || { followers: 0, following: 0 } : { followers: 0, following: 0 };
  const settings = userId ? userSettings[userId] || { isPrivate: false } : { isPrivate: false };
  
  const canSeeContent = userId === currentUserId || !settings.isPrivate || isFollowing;
  const userPosts = allPosts.filter(p => p.authorUid === userId || (userId === 'test-user-id' && p.authorUid === 'test-user-id'));

  const handleMessage = () => {
    if (!userId || userId === currentUserId) return;
    
    // Check if conversation already exists
    const existingConv = conversations.find(c => 
      c.participants.includes(currentUserId) && c.participants.includes(userId)
    );

    if (existingConv) {
      navigate(`/messages/${existingConv.id}`);
    } else {
      const newId = createConversation([currentUserId, userId]);
      navigate(`/messages/${newId}`);
    }
  };

  const handleFollowAction = () => {
    if (!userId || userId === currentUserId) return;
    
    if (isFollowing) {
      toggleFollow(userId);
    } else if (settings.isPrivate) {
      if (!hasRequested) {
        requestFollow(userId);
      }
    } else {
      toggleFollow(userId);
    }
  };

  useEffect(() => {
    setLoading(true);
    // Mock user data fetching
    setTimeout(() => {
      setUser({
        displayName: userId || 'Test User',
        photoURL: `https://picsum.photos/seed/${userId}/200/200`
      });
      setLoading(false);
    }, 300);
  }, [userId]);

  if (loading) return <div className="pt-24 sm:pt-24 sm:pl-72 text-center text-gray-500 font-medium">Loading profile...</div>;
  if (!user) return <div className="pt-24 sm:pt-24 sm:pl-72 text-center text-gray-500 font-medium">User not found.</div>;

  return (
    <div className="max-w-2xl mx-auto pt-24 pb-20 px-4 sm:pt-24 sm:pl-72">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-1">
            <div className="w-full h-full rounded-full bg-white p-1">
              <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden">
                {user.photoURL && <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
              </div>
            </div>
          </div>
          <div className="text-center sm:text-left space-y-4 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h1 className="text-3xl font-black tracking-tight">{user.displayName}</h1>
                {settings.isPrivate && <Lock className="w-5 h-5 text-gray-400" />}
              </div>
              
              <div className="flex gap-2 justify-center sm:justify-end">
                {userId === currentUserId ? (
                  <button 
                    onClick={() => toggleProfileVisibility(currentUserId)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-all border border-gray-100"
                  >
                    <Settings className="w-4 h-4" />
                    {settings.isPrivate ? 'Make Public' : 'Make Private'}
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={handleFollowAction}
                      className={`flex items-center justify-center gap-2 px-6 py-2 font-bold rounded-xl transition-all active:scale-95 shadow-lg ${
                        isFollowing 
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-gray-100' 
                          : hasRequested
                          ? 'bg-amber-50 text-amber-600 border border-amber-100 shadow-none'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
                      }`}
                    >
                      {isFollowing ? <UserCheck className="w-4 h-4" /> : hasRequested ? <Clock className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                      {isFollowing ? 'Following' : hasRequested ? 'Requested' : 'Follow'}
                    </button>
                    <button 
                      onClick={handleMessage}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all active:scale-95"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-6 text-sm font-bold text-gray-400 uppercase tracking-widest justify-center sm:justify-start">
              <span>{userPosts.length} Posts</span>
              <span>{stats.followers} Followers</span>
              <span>{stats.following} Following</span>
            </div>
          </div>
        </div>

        {/* Follow Requests for current user */}
        {userId === currentUserId && incomingRequests.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-50">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Follow Requests</h3>
            <div className="space-y-3">
              {incomingRequests.map(reqId => (
                <div key={reqId} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                      <img src={`https://picsum.photos/seed/${reqId}/100/100`} alt={reqId} />
                    </div>
                    <span className="font-bold text-sm">{reqId}</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => approveFollow(reqId)}
                      className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => rejectFollow(reqId)}
                      className="p-2 bg-white border border-gray-200 text-gray-400 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ProfileSuggestions />

      <div className="space-y-8">
        {canSeeContent ? (
          userPosts.length > 0 ? (
            userPosts.map((post) => (
              <Post 
                key={post.id} 
                id={post.id}
                username={post.authorUid}
                mediaUrl={post.mediaUrl} 
                type={post.type}
                caption={post.caption} 
                hashtags={post.hashtags}
                comments={post.comments}
              />
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-gray-400 font-medium">No posts yet.</p>
            </div>
          )
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-gray-300" />
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-xl tracking-tight">This Account is Private</h3>
              <p className="text-gray-400 text-sm">Follow this account to see their photos and videos.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
