"use client";
import Image from "next/image";
import {
  FaBullhorn,
  FaStar,
  FaUser,
  FaSearch,
  FaThList,
  FaMedal,
  FaWeight,
  FaRuler,
  FaUserFriends,
  FaFish,
  FaPlus,
  FaSignOutAlt,
} from "react-icons/fa";
import Post from "@/components/new/Post";
import Record from "@/components/new/RecordItem";
import FriendItem from "@/components/new/FriendItem";
import PostAddForm from "@/components/new/PostAddForm";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";

const WebApp = () => {
  const [showAddPostForm, setShowAddPostForm] = useState(false);
  const [posts, setPosts] = useState([]);
  const session = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [queryError, setQueryError] = useState(null);
  const [debounceTimeout, setDebounceTimeout] = useState(null); // For debounce timeout

  // Fetch posts from the API
  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      const data = await response.json();
      if (response.ok) {
        setPosts(data);
      } else {
        console.error("Failed to fetch posts:", data.error);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleSearch = async () => {
    // if (!searchQuery.trim()) return;

    try {
      const response = await fetch(
        `/api/users/getSimilar/?username=${searchQuery}`
      );
      const data = await response.json();

      if (!response.ok) {
        if (searchQuery) {
          setQueryError(data.error || "No matching users found");
        } else {
          setQueryError(null);
        }
        setSearchResults([]);
      } else {
        setSearchResults(data);
        setQueryError(null);
      }
    } catch (err) {
      setQueryError("Failed to fetch data");
      setSearchResults([]);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);

    // Clear the previous timeout to reset the debounce
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Set a new timeout to fetch after 500ms
    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 500); // 500ms debounce delay
    setDebounceTimeout(timeoutId);
  };

  useEffect(() => {
    if (!searchQuery) {
      return;
    }
    handleSearch();
  }, [searchQuery]);

  useEffect(() => {
    fetchPosts(); // Fetch once immediately

    const interval = setInterval(() => {
      fetchPosts();
    }, 500); // Fetch every second

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);
  return (
    <section className="bg-gray-100 h-dvh w-full flex max-xl:flex-col">
      <nav className="w-96 h-full bg-white border-r max-xl:h-fit max-xl:w-full border-gray-200">
        <ul className="flex flex-col h-fit w-full">
          <li className="w-full h-fit p-4 flex items-center gap-x-4">
            <Image
              alt="Fishdecks logo"
              src="/images/logo.svg"
              width={32}
              height={32}
            />
            <h1 className="font-medium text-2xl text-gray-800">Fishdecks</h1>
          </li>
          <li className="w-full h-fit p-4 flex items-center gap-x-4">
            <h2 className="text-xl font-medium">Menu główne</h2>
          </li>
          <a
            className="text-gray-700 hover:text-blue-500 hover:bg-gray-100 transition-all duration-300 rounded-xl"
            href="/webapp"
          >
            <li className="w-full h-fit p-4 flex items-center gap-x-4">
              <FaBullhorn className="text-2xl" />
              <h3 className="text-xl font-medium">Feed</h3>
            </li>
          </a>
          <a
            className="text-gray-700 hover:text-blue-500 hover:bg-gray-100 transition-all duration-300 rounded-xl"
            href="/webapp/records"
          >
            <li className="w-full h-fit p-4 flex items-center gap-x-4">
              <FaStar className="text-2xl" />
              <h3 className="text-xl font-medium">Rekordziści</h3>
            </li>
          </a>
          <a
            className="text-gray-700 hover:text-blue-500 hover:bg-gray-100 transition-all duration-300 rounded-xl"
            href={`/profile/${session?.data?.user?.username}?username=${session?.data?.user?.username}`}
          >
            <li className="w-full h-fit p-4 flex items-center gap-x-4">
              <FaUser className="text-2xl" />
              <h3 className="text-xl font-medium">Profil</h3>
            </li>
          </a>
          <button
            className="text-gray-700 hover:text-blue-500 hover:bg-gray-100 transition-all duration-300 rounded-xl"
            onClick={() =>
              signOut({
                callbackUrl: "/",
              })
            }
          >
            <li className="w-full h-fit p-4 flex items-center gap-x-4">
              <FaSignOutAlt className="text-2xl text-red-500" />
              <h3 className="text-xl font-medium text-red-500">Wyloguj</h3>
            </li>
          </button>
        </ul>
      </nav>
      {/* Posts */}
      <section className="w-full h-full flex flex-col items-center">
        <section className="w-3/4 max-xl:w-full h-16 mt-8 gap-x-8 shadow-xl z-10 rounded-xl bg-white border-b border-gray-200 flex flex-col items-center">
          <section className="w-full h-16 flex items-center gap-x-8 p-8">
            <input
              type="text"
              placeholder="Szukaj..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="w-full h-full p-4 py-6 rounded-xl border border-gray-200 font-medium text-lg"
            />
            <button
              onClick={handleSearch}
              className="hover:cursor-pointer text-gray-400 hover:text-gray-600 transition-all duration-300"
            >
              <FaSearch className="text-2xl" />
            </button>
          </section>
          <AnimatePresence>
            {queryError && <p className="text-red-500 mt-4">{queryError}</p>}
            {searchResults.length > 0 && (
              <ul className="bg-white shadow-lg rounded-lg w-full p-4">
                {searchResults.map((user) => (
                  <motion.li
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    key={user._id}
                    className="p-2 border-b border-gray-200 hover:bg-gray-100 transition-all"
                  >
                    <a
                      href={`/profile/${user.username}?username=${user.username}`}
                      className="block text-lg font-medium text-gray-800"
                    >
                      {user.username}
                    </a>
                  </motion.li>
                ))}
              </ul>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showAddPostForm ? (
              <PostAddForm setElementVisibility={setShowAddPostForm} />
            ) : null}
          </AnimatePresence>
        </section>
        {/* Posts display */}
        <section className="overflow-y-auto w-4/5 max-xl:w-full h-full flex flex-col items-center px-4">
          {posts.map((el) => {
            return (
              <Post
                key={el._id}
                author={el.user}
                content={el.content}
                postDate={el.postDate ? el.postDate : el.date}
                species={el.species}
                postId={el._id}
                postLikes={el.likes}
                comments={el.comments}
                catchDate={el.catchDate}
                length={el.length}
                weight={el.weight}
              />
            );
          })}
        </section>
      </section>
      {/* END Posts */}

      <section className="w-128 max-xl:hidden max-xl:w-full max-xl:h-fit border-l border-gray-200 p-4 overflow-y-auto">
        <section className="w-full h-fit flex flex-col items-center gap-y-4 p-4 bg-white rounded-xl">
          <section className="w-fit h-full flex items-center gap-x-4">
            <FaMedal className="text-2xl text-yellow-600" />
            <h3 className="text-lg font-medium">Obecni rekordziści</h3>
          </section>
          <section className="w-full h-fit px-4">
            <hr className="border-gray-200" />
          </section>
          <section className="w-fit h-full flex items-center gap-x-4">
            <FaWeight className="text-2xl text-gray-400" />
            <h4 className="text-lg font-medium">Najcięższa ryba</h4>
          </section>
          <section className="w-full p-2 h-full flex flex-col items-center">
            <ul className="w-full h-fit flex flex-col items-center gap-y-4">
              <Record
                recordHolder="Barrack Obama"
                species="Karp"
                recordType="Waga"
                recordValue="10kg"
                recordDate="2024-05-01"
                place="1"
              />
              <Record
                recordHolder="Michael Jackson"
                species="Karp"
                recordType="Waga"
                recordValue="8kg"
                recordDate="2024-05-01"
                place="2"
              />
              <Record
                recordHolder="David Beckham"
                species="Karp"
                recordType="Waga"
                recordValue="5kg"
                recordDate="2024-05-01"
                place="3"
              />
            </ul>
          </section>
          <section className="w-full h-fit px-4">
            <hr className="border-gray-200" />
          </section>
          <section className="w-fit h-full flex items-center gap-x-4">
            <FaRuler className="text-2xl text-gray-400" />
            <h4 className="text-lg font-medium">Najdłuższa ryba</h4>
          </section>
          <section className="w-full p-2 h-full flex flex-col items-center">
            <ul className="w-full h-fit flex flex-col items-center gap-y-4">
              <Record
                recordHolder="Barrack Obama"
                species="Sczupak"
                recordType="Długość"
                recordValue="100cm"
                recordDate="2024-05-01"
                place="1"
              />
              <Record
                recordHolder="Michael Jackson"
                species="Sczupak"
                recordType="Długość"
                recordValue="80cm"
                recordDate="2024-05-01"
                place="2"
              />
              <Record
                recordHolder="David Beckham"
                species="Sczupak"
                recordType="Długość"
                recordValue="77cm"
                recordDate="2024-05-01"
                place="3"
              />
            </ul>
          </section>
        </section>
      </section>
      <section className="w-128 max-xl:hidden max-xl:w-full h-full max-xl:shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6)] bg-white border-l border-gray-200">
        <ul className="flex flex-col h-fit w-full overflow-y-auto">
          <li className="w-full h-fit p-4 flex items-center gap-x-4">
            <FaUserFriends className="text-2xl" />
            <h3 className="font-medium text-2xl text-gray-800">Znajomi</h3>
          </li>
          <section className="w-full h-fit px-4">
            <hr className="border-gray-200" />
          </section>
          <FriendItem username="John Doe" isActive={true} />
          <FriendItem username="Barrack Obama" isActive={true} />
          <FriendItem username="Michael Jackson" isActive={true} />
          <FriendItem username="David Beckham" isActive={true} />
          <FriendItem username="Katty Perry" isActive={false} />
        </ul>
      </section>
    </section>
  );
};

export default WebApp;
