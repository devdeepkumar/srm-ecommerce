// components/RatingDisplay.jsx

import Star from "@mui/icons-material/Star";
import StarHalf from "@mui/icons-material/StarHalf";
import StarBorder from "@mui/icons-material/StarBorder";

const RatingDisplay = ({ rating }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<Star key={i} style={{ color: "#facc15" }} />);
    } else if (rating >= i - 0.5) {
      stars.push(<StarHalf key={i} style={{ color: "#facc15" }} />);
    } else {
      stars.push(<StarBorder key={i} style={{ color: "#facc15" }} />);
    }
  }

  return <div style={{ display: "flex", gap: 2 }}>{stars}</div>;
};

export default RatingDisplay;
