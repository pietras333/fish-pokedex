import { FaHeart, FaRegHeart, FaComment, FaRegComment } from "react-icons/fa";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import speciesData from "@/data/species.json";
import formatDate from "@/lib/dateFormat";

const Post = ({ post }) => {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(post.likedByUser || false);
  const [likes, setLikes] = useState(post.likes || 0);
  const [commented, setCommented] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(post.comments || []);

  const handleLike = async () => {
    if (!session) return alert("Musisz być zalogowany!");

    const action = liked ? "unlike" : "like";
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);

    try {
      await fetch("/api/posts/like", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post._id, action }),
      });
    } catch (error) {
      console.error("Błąd polubienia:", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!session) return alert("Musisz być zalogowany!");
    if (!comment.trim()) return;

    const newComment = {
      text: comment,
      author: session?.user?.username || "Anonim",
      date: new Date().toLocaleString(),
      avatar: session?.user?.image || "",
    };

    setComments([...comments, newComment]);
    setComment("");

    try {
      await fetch("/api/posts/comment", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post._id, comment }),
      });
    } catch (error) {
      console.error("Błąd dodawania komentarza:", error);
    }
  };

  return (
    <section className="w-3/4 h-fit flex flex-col p-4 mt-4">
      {/* Author Section */}
      <section className="flex gap-x-4 p-4 bg-[#272727] text-white rounded-tl-3xl rounded-tr-3xl">
        {post.authorImage ? (
          <img
            src={post.authorImage}
            alt="Author"
            className="w-12 h-12 rounded-full"
          />
        ) : (
          <div className="bg-blue-500 w-[48px] h-[48px] rounded-3xl"></div>
        )}
        <section className="w-fit h-full flex flex-col">
          <h2 className="text-xl font-medium max-xl:text-lg">
            {post.user || "Unknown"}
          </h2>
          <h3 className="font-light max-xl:text-sm">
            {formatDate(post.postDate) || "Unknown date"}
          </h3>
        </section>
      </section>

      {/* Image & Details */}
      <section className="w-full h-fit flex flex-col items-center bg-[#f2f1f1]">
        <img
          src={speciesData[post.species]?.image}
          alt="SPECIES image"
          className="w-3/4 h-fit"
        />
        <section className="w-full rounded-br-3xl text-xl h-fit flex justify-around p-4 font-light bg-[#272727] text-white">
          <p>Długość: {post.length}cm</p>
          <p>Waga: {post.weight}kg</p>
          <p>Data: {post.catchDate}</p>
          {post.isGoldMedal && (
            <p className="text-yellow-400 font-medium">Złoto medalowa🏅</p>
          )}
        </section>
      </section>

      {/* Like & Comment Buttons */}
      <section className="flex w-full p-8 gap-x-10">
        <button
          className="text-red-500 hover:cursor-pointer hover:text-red-700 duration-300 transition-colors text-3xl flex items-center gap-2"
          onClick={handleLike}
        >
          {liked ? <FaHeart /> : <FaRegHeart />} <span>{likes}</span>
        </button>
        <button
          className="text-blue-500 hover:cursor-pointer hover:text-blue-700 duration-300 transition-colors text-3xl flex items-center gap-2"
          onClick={() => setCommented(!commented)}
        >
          {commented ? <FaComment /> : <FaRegComment />}{" "}
          {comments.length > 0 && <span>({comments.length})</span>}
        </button>
      </section>

      {/* Comments Section */}
      <AnimatePresence>
        {commented && (
          <motion.section
            className="w-full p-4 flex flex-col gap-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex gap-4">
              <textarea
                className="w-full p-2 border rounded-md"
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                className="px-8 py-4 rounded-xl bg-green-500 text-white text-lg font-medium hover:cursor-pointer hover:bg-green-700 transition duration-300"
                onClick={handleCommentSubmit}
              >
                Prześlij
              </button>
            </div>
            <div className="w-full flex flex-col gap-2">
              <AnimatePresence>
                {comments.map((c, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-4 p-2 bg-gray-200 rounded-md"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {c.avatar ? (
                      <img
                        src={c.avatar}
                        alt={c.author}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="bg-blue-500 w-[40px] h-[40px] rounded-full"></div>
                    )}
                    <div>
                      <p className="font-medium">{c.author}</p>
                      <p className="text-sm text-gray-600">{c.date}</p>
                      <p>{c.text}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Post;
