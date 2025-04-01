const FriendItem = ({ username, isActive }) => {
  return (
    <a
      href={`/profile/${username}`}
      className="hover:cursor-pointer hover:text-blue-600 text-gray-800 hover:bg-gray-100 transition-all duration-300"
    >
      <li className="w-full h-fit p-4 flex items-center gap-x-4">
        <div className="w-8 h-8 bg-gray-800 rounded-full"></div>
        <h3 className="font-medium text-xl ">{username}</h3>
        <div
          className={`w-2 h-2 rounded-full ${
            isActive ? "bg-green-500" : "bg-gray-200"
          }`}
        ></div>
      </li>
    </a>
  );
};
export default FriendItem;
