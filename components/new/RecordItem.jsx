import { FaMedal } from "react-icons/fa";

const RecordItem = ({
  recordHolder,
  species,
  recordType,
  recordValue,
  recordDate,
  place,
}) => {
  const medals = [
    {
      id: 1,
      color: "yellow-600",
      text: "Złoty",
    },
    {
      id: 2,
      color: "gray-400",
      text: "Srebrny",
    },
    {
      id: 3,
      color: "amber-800",
      text: "Brązowy",
    },
  ];
  return (
    <li className="w-full h-fit flex flex-col items-center bg-gray-200 p-2 rounded-xl">
      <section className="w-full h-fit flex justify-center items-center gap-x-4">
        <FaMedal className={`text-2xl text-${medals[place - 1].color}`} />
        <a
          href={`/profile/${recordHolder}`}
          className="hover:cursor-pointer hover:text-blue-600 transition-all duration-300"
        >
          <h4 className="text-lg font-medium">{recordHolder}</h4>
        </a>
      </section>
      <section className="text-lg">
        <p>
          <span className="font-medium">Gatunek</span>: {species}
        </p>
        <p>
          <span className="font-medium">{recordType}</span>: {recordValue}
        </p>
        <p>
          <span className="font-medium">Połów</span>: {recordDate}
        </p>
      </section>
    </li>
  );
};
export default RecordItem;
