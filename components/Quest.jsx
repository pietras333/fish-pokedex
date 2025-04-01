import { FaCheck } from "react-icons/fa";

const Quest = ({ quest }) => {
  const { name, progress, goal, description } = quest;
  return (
    <li className="w-3/4 h-fit gap-x-4">
      {progress === goal ? (
        <section className="bg-green-500 h-full w-full p-8 items-center rounded-xl text-white flex flex-col gap-y-4">
          <h3 className="text-3xl text-center">{name}</h3>
          <FaCheck className="text-9xl text-center" />
        </section>
      ) : (
        <section className="bg-green-900 h-full w-full p-8 rounded-xl text-white flex flex-col gap-y-4">
          <h3 className="text-3xl text-center">{name}</h3>
          <p className="text-5xl text-center w-full h-fit">
            {progress}/{goal}
          </p>
          <p className="text-center text-lg">{description}</p>
        </section>
      )}
    </li>
  );
};
export default Quest;
