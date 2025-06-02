"use client";
import { useEffect, useState } from "react";
import { fetchSurveys, Survey } from "../surveyService";

function calculateAge(dateString: string) {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

const foodOptions = ["Pizza", "Pasta", "Pap and Wors"];
const likertStatements = [
  "I like to watch movies",
  "I like to listen to radio",
  "I like to eat out",
  "I like to watch  TV",
];
const ratingToNumber = {
  StronglyAgree: 5,
  Agree: 4,
  Neutral: 3,
  Disagree: 2,
  StronglyDisagree: 1,
};

export default function Results() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSurveys()
      .then((data) => setSurveys(data))
      .catch((err) => setError(err.message || "Failed to fetch results"))
      .finally(() => setLoading(false));
  }, []);

  // Aggregation logic
  const total = surveys.length;
  const ages = surveys
    .map((s) => (s.dateOfBirth ? calculateAge(s.dateOfBirth) : null))
    .filter((a): a is number => a !== null && !isNaN(a));
  const avgAge = ages.length
    ? (ages.reduce((a, b) => a + b, 0) / ages.length).toFixed(1)
    : "-";
  const maxAge = ages.length ? Math.max(...ages) : "-";
  const minAge = ages.length ? Math.min(...ages) : "-";

  const foodPercent = (food: string) => {
    if (!total) return "-";
    const count = surveys.filter((s) => s.favoriteFood.includes(food)).length;
    return ((count / total) * 100).toFixed(1) + "%";
  };

  // Average rating per statement
  function averageRating(statement: string) {
    const ratings = surveys
      .map((s) => s.ratings?.[statement])
      .filter((r) => r && ratingToNumber[r as keyof typeof ratingToNumber])
      .map((r) => ratingToNumber[r as keyof typeof ratingToNumber]);
    if (!ratings.length) return "-";
    const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    return avg.toFixed(2);
  }

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "40px auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Survey Results</h1>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {!loading && !error && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            marginTop: 32,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Total number of surveys :</span>
            <span>{total}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Average Age :</span>
            <span>{avgAge}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Oldest person who participated in survey :</span>
            <span>{maxAge}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Youngest person who participated in survey :</span>
            <span>{minAge}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Percentage of people who like Pizza :</span>
            <span>{foodPercent("Pizza")}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Percentage of people who like Pasta :</span>
            <span>{foodPercent("Pasta")}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Percentage of people who like Pap and Wors :</span>
            <span>{foodPercent("Pap and Wors")}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 24,
              fontWeight: 600,
            }}
          >
            <span>People who like to watch movies :</span>
            <span>{averageRating("I like to watch movies")}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>People who like to listen to radio :</span>
            <span>{averageRating("I like to listen to radio")}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>People who like to eat out :</span>
            <span>{averageRating("I like to eat out")}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>People who like to watch TV :</span>
            <span>{averageRating("I like to watch  TV")}</span>
          </div>
        </div>
      )}
    </div>
  );
}
