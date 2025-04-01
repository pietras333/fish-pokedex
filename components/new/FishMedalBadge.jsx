const FishMedalBadge = ({ percentage }) => {
  let medalMessage = "";
  let medalColor = "";

  if (percentage >= 90) {
    medalMessage = "💎 Diamentowa ryba 🐠";
    medalColor = "text-blue-500"; // Diamond color
  } else if (percentage >= 80) {
    medalMessage = "🏅 Złotomedalowa ryba 🐟";
    medalColor = "text-yellow-500";
  } else if (percentage >= 70) {
    medalMessage = "🥇 Platynowa ryba 🐡";
    medalColor = "text-gray-300"; // Platinum color (can use a light gray or your preferred shade)
  } else if (percentage >= 60) {
    medalMessage = "🥈 Srebrnomedalowa ryba 🐠";
    medalColor = "text-silver-500"; // Silver color
  } else if (percentage >= 50) {
    medalMessage = "🏅 Miedziana ryba 🐟";
    medalColor = "text-orange-500"; // Copper or bronze color
  } else if (percentage >= 30) {
    medalMessage = "🥉 Brązowomedalowa ryba 🐡";
    medalColor = "text-brown-500"; // Bronze color
  } else if (percentage >= 10) {
    medalMessage = "😞 Blisko medalu, ale nie tym razem! 💔";
    medalColor = "text-red-500"; // Red color for a disappointing performance
  } else {
    medalMessage = "😢 Ryba bez medalu 💔";
    medalColor = "text-gray-500";
  }

  return (
    <h4
      className={`${medalColor} text-lg font-thin p-2 rounded-xl text-center`}
    >
      {medalMessage}
    </h4>
  );
};

export default FishMedalBadge;
