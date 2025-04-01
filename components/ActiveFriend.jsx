const ActiveFriend = ({ username }) => {
  if (!username) return null;
  return (
    <li className="w-full h-fit p-4 flex items-center justify-between gap-x-4">
      <section className="w-fit flex items-center gap-x-4">
        <div className="bg-blue-500 w-[48px] h-[48px] rounded-3xl"></div>
        <a
          href={`/webapp/profile/${username}`}
          className="border-b-4 hover:text-green-500 hover:tracking-wide border-transparent hover:border-green-500 transition-all duration-300"
        >
          <h3 className="text-2xl">{username}</h3>
        </a>
      </section>
      <div className="bg-green-500 w-[16px] h-[16px] rounded-3xl"></div>
    </li>
  );
};

export default ActiveFriend;
