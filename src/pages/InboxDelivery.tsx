import React from "react";
// import axios from "axios";
// import { Loader2, Copy, RefreshCw, CheckCircle } from "lucide-react";
import Header from "../components/Header";
import Layout from "../components/Layout";
// import { config } from "../config/env";

const InboxPostDelivery = () => {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <Layout>
      <div className="pt-4">
        <Header
          title="Inbox Post Delivery"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showBackButton
        />
      </div>      
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#fc00ff33] to-transparent my-2" />      
      <div className="w-full p-7">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="text-3xl font-bold text-[#d9d9d9] mb-4">
            Inbox Post Delivery
          </h2>
          <p className="text-lg text-[#b0b0b0] max-w-xl text-center mb-8">
            Welcome to Inbox Post Delivery — a simple way to receive your daily,
            copy-ready LinkedIn posts directly in your inbox. Generate
            personalized posts and manage delivery settings here. Check back
            soon for availability.
          </p>
          {/* Chat UI or coming soon message can go here */}
          <div className="rounded-lg bg-[#232323] p-8 shadow-lg text-[#d9d9d9]">
            <span className="text-xl font-semibold">Coming Soon...</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InboxPostDelivery;

// const InboxPostDelivery = () => {
//   const [text, setText] = useState("");
//   const [hashtags, setHashtags] = useState("");
//   const [userId] = useState("abcd"); // setUserId removed, not used
//   interface ScheduledPost {
//     _id: string;
//     text: string;
//     hashtags: string[];
//     scheduledDate: string;
//     sent?: boolean;
//   }
//   const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [copied, setCopied] = useState(false);
//   const [dateQuery, setDateQuery] = useState("");
//   const [fetchingPosts, setFetchingPosts] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   const handleCreatePost = async () => {
//     if (!text.trim() || !hashtags.trim())
//       return alert("Post text and hashtags required!");
//     setLoading(true);
//     try {
//       await axios.post(`${config.apiBaseUrl}/mail/posts/create`, {
//         text,
//         hashtags: hashtags.split(",").map((tag) => tag.trim()),
//         userId,
//       });
//       alert("✅ Post created!");
//       setText("");
//       setHashtags("");
//     } catch (error) {
//       console.error(error);
//       alert("Error creating post");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTriggerEmails = async () => {
//     setLoading(true);
//     try {
//       await axios.post(`${import.meta.env.VITE_API_BASE_URL}/mail/trigger`);
//       alert("📧 Emails triggered!");
//     } catch (error) {
//       console.error(error);
//       alert("Failed to trigger emails");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFetchPosts = async () => {
//     if (!dateQuery.trim()) return alert("Please enter a date");
//     setFetchingPosts(true);
//     try {
//       const res = await axios.get(
//         `${import.meta.env.VITE_API_BASE_URL}/mail/posts?date=${dateQuery}`
//       );
//       setScheduledPosts(res.data.posts || []);
//     } catch (err) {
//       console.error(err);
//       alert("Error fetching posts");
//     } finally {
//       setFetchingPosts(false);
//     }
//   };

//   const handleCopy = (content: string) => {
//     navigator.clipboard.writeText(content);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 1200);
//   };

//   return (
//     <div className="min-h-screen">
//       <div className="pt-4">
//         <Header
//           title="Inbox Post Delivery"
//           searchQuery={searchQuery}
//           setSearchQuery={setSearchQuery}
//           showBackButton
//         />
//       </div>
//       <div className="w-full h-px bg-gradient-to-r from-transparent via-[#fc00ff33] to-transparent my-2" />
//       <div className="max-w-3xl mx-auto p-6 rounded-lg shadow text-white space-y-6">
//         {/* <div className="flex items-center space-x-4 mb-4">
//           <div className="p-3 bg-purple-600 rounded-lg">
//             <Mail className="w-8 h-8 text-white" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold">Inbox Post Delivery</h1>
//             <p className="text-gray-400">
//               No platform needed. Get your post, daily, via email.
//             </p>
//           </div>
//         </div> */}

//         <div
//           style={{ background: "rgba(70,70,70,0.25)" }}
//           className="border border-purple-500/30 rounded-lg p-6"
//         >
//           <p className="text-purple-300 text-sm">
//             This feature sends your daily LinkedIn post to your inbox with
//             copy-ready formatting and hashtags.
//           </p>
//         </div>

//         {/* CREATE POST */}
//         <div
//           style={{ background: "rgba(70,70,70,0.25)" }}
//           className="rounded-lg p-6 space-y-4 border border-gray-500/30"
//         >
//           <h2 className="font-semibold text-lg">Create a Post</h2>
//           <textarea
//             className="w-full p-3 rounded-lg border border-gray-500/30 bg-[rgba(70,70,70,0.25)] text-white focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400 transition"
//             rows={4}
//             placeholder="Write your post content..."
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//           />
//           <input
//             className="w-full p-3 rounded-lg border border-gray-500/30 bg-[rgba(70,70,70,0.25)] text-white focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400 transition"
//             placeholder="Hashtags (comma-separated)"
//             value={hashtags}
//             onChange={(e) => setHashtags(e.target.value)}
//           />
//           <div className="flex justify-center">
//             <button
//               onClick={handleCreatePost}
//               disabled={loading || !text.trim() || !hashtags.trim()}
//               className={`btn py-1.5 px-4 rounded-md font-medium flex justify-center items-center shadow-md transition text-white text-sm$${
//                 !loading && text.trim() && hashtags.trim()
//                   ? " btn--default"
//                   : ""
//               }`}
//               style={{ minWidth: 120 }}
//             >
//               {loading ? (
//                 <Loader2 className="w-4 h-4 animate-spin mr-2" />
//               ) : null}
//               Create Post
//             </button>
//           </div>
//         </div>

//         {/* TRIGGER EMAIL */}
//         <div
//           style={{ background: "rgba(70,70,70,0.25)" }}
//           className="rounded-lg p-6 border border-gray-500/30"
//         >
//           <h2 className="font-semibold text-lg mb-2">Trigger Inbox Email</h2>
//           <div className="flex justify-center">
//             <button
//               onClick={handleTriggerEmails}
//               disabled={loading}
//               className="btn py-1.5 px-4 rounded-md font-medium flex justify-center items-center shadow-md transition text-white text-sm"
//               style={{ minWidth: 120, background: "rgba(70,70,70,0.25)" }}
//             >
//               {loading ? (
//                 <Loader2 className="w-4 h-4 animate-spin mr-2" />
//               ) : null}
//               Trigger Emails
//             </button>
//           </div>
//         </div>

//         {/* FETCH POSTS BY DATE */}
//         <div
//           style={{ background: "rgba(70,70,70,0.25)" }}
//           className="rounded-lg p-6 space-y-3 border border-gray-500/30"
//         >
//           <h2 className="font-semibold text-lg">Fetch Posts by Date</h2>
//           <input
//             type="date"
//             className="w-full p-2 rounded-lg border border-gray-500/30 bg-[rgba(70,70,70,0.25)] text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400 transition"
//             value={dateQuery}
//             onChange={(e) => setDateQuery(e.target.value)}
//           />
//           <div className="flex justify-center">
//             <button
//               onClick={handleFetchPosts}
//               disabled={fetchingPosts || !dateQuery.trim()}
//               className={`btn py-1.5 px-4 rounded-md font-medium flex justify-center items-center shadow-md transition text-white text-sm$${
//                 !fetchingPosts && dateQuery.trim() ? " btn--default" : ""
//               }`}
//               style={{ minWidth: 120 }}
//             >
//               {fetchingPosts ? (
//                 <Loader2 className="w-4 h-4 animate-spin mr-2" />
//               ) : (
//                 <RefreshCw className="w-4 h-4 mr-2" />
//               )}
//               Fetch Posts
//             </button>
//           </div>
//         </div>

//         {/* DISPLAY POSTS */}
//         {scheduledPosts.length > 0 && (
//           <div
//             style={{ background: "rgba(70,70,70,0.25)" }}
//             className="rounded-lg p-6 space-y-4 border border-gray-500/30"
//           >
//             <h2 className="font-semibold text-lg mb-2">Scheduled Posts</h2>
//             {scheduledPosts.map((post) => (
//               <div
//                 key={post._id}
//                 style={{ background: "rgba(70,70,70,0.25)" }}
//                 className="p-4 rounded-lg space-y-2 text-sm text-gray-200 border border-gray-500/30"
//               >
//                 <div className="flex justify-between items-center">
//                   <p className="text-purple-300 font-semibold">
//                     📌 {new Date(post.scheduledDate).toDateString()}
//                   </p>
//                   <button
//                     onClick={() =>
//                       handleCopy(post.text + "\n\n" + post.hashtags.join(" "))
//                     }
//                     className="flex items-center gap-1 px-3 py-1 rounded-md bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white text-xs font-medium shadow-md transition"
//                   >
//                     <Copy className="inline w-4 h-4 mr-1" />
//                     Copy Post
//                   </button>
//                 </div>
//                 <p className="whitespace-pre-line">{post.text}</p>
//                 <p className="text-purple-400">{post.hashtags.join(" ")}</p>
//                 {post.sent && (
//                   <p className="text-green-400 flex items-center gap-1">
//                     <CheckCircle className="w-4 h-4" />
//                     Email sent
//                   </p>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}

//         {copied && (
//           <p className="text-green-400 text-center text-sm">
//             📋 Copied to clipboard!
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default InboxPostDelivery;
