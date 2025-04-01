"use client";
import { useSession } from "next-auth/react";
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
import Record from "@/components/new/RecordItem";
import { signOut } from "next-auth/react";

const Records = () => {
  const session = useSession();

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
      <section className="w-128 max-xl:w-full max-xl:h-fit border-l border-gray-200 p-4 overflow-y-auto">
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
    </section>
  );
};
export default Records;
