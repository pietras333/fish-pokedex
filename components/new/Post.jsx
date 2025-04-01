import { FaUser, FaEllipsisH, FaHeart, FaComment } from "react-icons/fa";
import speciesData from "@/data/species.json";
import { useState, useEffect, userfe } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import formatDate from "@/lib/dateFormat";
import FishMedalBadge from "@/components/new/FishMedalBadge";

const Post = ({
  author,
  postDate,
  catchDate,
  content,
  species,
  weight,
  length,
  postId,
  comments,
  postLikes,
}) => {
  const [comment, setComment] = useState("");
  const [likes, setLikes] = useState(0);
  const [commentsVisibility, setCommentsVisibility] = useState(false);
  const [evaluatedLength, setEvaluatedLength] = useState(0);
  const [evaluatedWeight, setEvaluatedWeight] = useState(0);

  const handleLike = async (e) => {
    e.preventDefault();
    setLikes(likes > 0 ? 0 : 1);

    try {
      const response = await fetch("/api/posts/like", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: postId,
          action: `${likes > 0 ? "unlike" : "like"}`,
        }),
      });
      if (response.ok) {
        console.log("Post liked successfully");
      } else {
        console.error("Failed to like post");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/posts/comment", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: postId,
          comment: comment,
        }),
      });
      if (response.ok) {
        setCommentsVisibility(true);
        setComment("");
        console.log("Comment added successfully");
      } else {
        console.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const evaluateWeight = () => {
    const weightRecord = speciesData[species].recordWeight;
    const currentWeight = weight; // You may need to replace this with the actual weight value you're comparing

    // Calculate the percentage
    const percentage = (currentWeight / weightRecord) * 100;

    // Return the percentage as a float
    return Math.floor(percentage);
  };

  const evaluateLength = () => {
    const lengthRecord = speciesData[species].recordLength;
    const currentLength = length; // You may need to replace this with the actual length value you're comparing

    // Calculate the percentage
    const percentage = (currentLength / lengthRecord) * 100;

    return Math.floor(percentage);
  };

  useEffect(() => {
    const weightPercentage = evaluateWeight();
    setEvaluatedWeight(weightPercentage);
  }, [weight]); // Recalculate when weight changes

  useEffect(() => {
    const lengthPercentage = evaluateLength();
    setEvaluatedLength(lengthPercentage);
  }, [length]); // Recalculate when length changes

  return (
    <section className="w-full bg-white rounded-xl h-fit mt-8 flex flex-col items-center">
      <section className="px-8 p-4 w-full flex gap-x-8 items-center justify-between">
        <section className="flex items-center gap-x-8">
          <FaUser className="text-2xl text-gray-400" />
          <section className="w-fit h-full flex flex-col">
            <a
              href={`/profile/${author}?username=${author}`}
              className="hover:underline"
            >
              <h3 className="text-lg font-medium">{author}</h3>
            </a>

            <p>{formatDate(postDate)}</p>
          </section>
        </section>
        <button className="hover:cursor-pointer text-gray-400 hover:text-gray-600 transition-all duration-300">
          <FaEllipsisH className="text-2xl " />
        </button>
      </section>
      <section className="w-full h-fit px-8 p-4">
        <p>{content}</p>
      </section>
      <section className="w-full max-xl:flex-col h-fit px-8 p-4 flex gap-x-8 max-xl:gap-y-4">
        <section className="w-3/5 max-xl:w-full h-128 bg-gray-200 rounded-xl flex justify-center items-center">
          <Image
            width={512}
            height={512}
            src={speciesData[species].image}
            alt={species}
          />
        </section>
        <section className="w-2/5 max-xl:w-full max-xl:h-fit h-full bg-gray-200 rounded-xl">
          <ul className="w-full h-full p-8 gap-8 flex flex-col">
            <li className="w-full p-4 flex flex-col bg-white rounded-xl gap-y-2 justify-center items-center">
              <h3 className="text-xl font-medium text-center">Waga</h3>
              <hr className="border-gray-200 w-full" />
              <div className="w-full h-8">
                <div
                  style={{ width: `${evaluatedWeight}%` }}
                  className="max-w-full h-full bg-blue-500 rounded-xl"
                ></div>
              </div>
              <p className="text-yellow-500 text-center text-lg">{weight}kg</p>
            </li>
            <li className="w-full p-4 flex flex-col bg-white rounded-xl gap-y-2 justify-center items-center">
              <h3 className="text-xl font-medium text-center">Długość</h3>
              <hr className="border-gray-200 w-full" />
              <div className="w-full h-8">
                <div
                  style={{ width: `${evaluatedLength}%` }}
                  className="max-w-full h-full bg-blue-500 rounded-xl"
                ></div>
              </div>
              <p className="text-yellow-500 text-center text-lg">{length}cm</p>
            </li>
            <li className="w-full p-4 flex flex-col bg-white rounded-xl gap-y-2 justify-center items-center">
              <h3 className="text-xl font-medium text-center">Data połowu</h3>
              <hr className="border-gray-200 w-full" />
              <p className="text-center text-lg font-thin">{catchDate}</p>
            </li>
            <li>
              <FishMedalBadge
                percentage={
                  speciesData[species].evaluation === "weight"
                    ? evaluatedWeight
                    : evaluatedLength
                }
              />
            </li>
          </ul>
        </section>
      </section>
      <section className="w-full h-fit px-8 p-4">
        <hr className="border-gray-200" />
      </section>
      {/* Comments */}
      <section className="w-full h-fit px-8 p-4 flex gap-x-8">
        <button
          onClick={(e) => handleLike(e)}
          className="hover:cursor-pointer text-gray-400 hover:text-gray-600 transition-all duration-300"
        >
          {likes > 0 ? (
            <FaHeart className="text-2xl text-red-500" />
          ) : (
            <FaHeart className="text-2xl text-gray-400" />
          )}
        </button>
        <button
          onClick={() => {
            setCommentsVisibility((prev) => !prev);
          }}
          className="hover:cursor-pointer text-gray-400 hover:text-gray-600 transition-all duration-300"
        >
          {commentsVisibility ? (
            <FaComment className="text-2xl text-blue-500" />
          ) : (
            <FaComment className="text-2xl" />
          )}
        </button>
      </section>

      <section className="w-full h-fit px-8 p-4 flex gap-x-8 justify-between">
        <section className="w-fit h-full flex items-center gap-x-4">
          <p className="text-lg font-medium">{postLikes}</p>
          <FaHeart className="text-lg text-gray-600" />
        </section>
        <section className="w-fit h-full flex items-center gap-x-4">
          <p className="text-lg font-medium">
            {comments ? comments.length : ""}
          </p>
          <FaComment className="text-lg text-gray-600" />
        </section>
      </section>
      <section className="w-full h-fit px-8 p-4">
        <hr className="border-gray-200" />
      </section>
      <section className="w-full h-fit p-8 flex">
        {commentsVisibility && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-fit flex flex-col gap-y-4"
          >
            <AnimatePresence>
              {comments &&
                comments.map((comment, id) => (
                  <section
                    key={id}
                    className="w-full h-fit flex flex-col gap-x-4 border border-gray-200 p-4 rounded-xl"
                  >
                    <section className="w-full h-fit flex items-center gap-x-4">
                      <section className="flex w-full justify-between items-center gap-x-4">
                        <FaUser className="text-3xl text-gray-400" />
                        <section className="w-full h-fit flex flex-col">
                          <h3 className="text-lg font-medium">
                            {comment.author}
                          </h3>
                        </section>
                      </section>
                      <section className="w-fit text-center h-fit font-thin text-sm">
                        <p>{formatDate(comment.date)}</p>
                      </section>
                    </section>
                    <p>{comment.text}</p>
                  </section>
                ))}
            </AnimatePresence>
          </motion.section>
        )}
      </section>
      <section className="w-full h-fit p-8 flex">
        <form className="w-full" onSubmit={(e) => handleComment(e)}>
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            type="text"
            placeholder="Dodaj komentarz..."
            className="w-full h-full p-4 rounded-xl border border-gray-200 font-medium text-lg"
          />
        </form>
      </section>
    </section>
  );
};
export default Post;
