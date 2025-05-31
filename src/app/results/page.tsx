"use client";
import { useEffect, useState } from "react";
import { fetchSurveys, Survey } from "../surveyService";

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

  return (
    <div>
      <h1>Results</h1>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {!loading && !error && (
        <table
          style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}
        >
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th style={{ border: "1px solid #ccc", padding: 6 }}>
                Full Names
              </th>
              <th style={{ border: "1px solid #ccc", padding: 6 }}>Email</th>
              <th style={{ border: "1px solid #ccc", padding: 6 }}>
                Date of Birth
              </th>
              <th style={{ border: "1px solid #ccc", padding: 6 }}>
                Contact Number
              </th>
              <th style={{ border: "1px solid #ccc", padding: 6 }}>
                Favorite Food
              </th>
              <th style={{ border: "1px solid #ccc", padding: 6 }}>Ratings</th>
            </tr>
          </thead>
          <tbody>
            {surveys.map((survey, idx) => (
              <tr key={idx}>
                <td style={{ border: "1px solid #ccc", padding: 6 }}>
                  {survey.fullName}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 6 }}>
                  {survey.email}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 6 }}>
                  {survey.dateOfBirth}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 6 }}>
                  {survey.contactNumber}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 6 }}>
                  {survey.favoriteFood.join(", ")}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 6 }}>
                  {survey.ratings &&
                    Object.entries(survey.ratings).map(
                      ([statement, rating]) => (
                        <div key={statement}>
                          <strong>{statement}:</strong>{" "}
                          {rating
                            .replace(/_/g, " ")
                            .toLowerCase()
                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                        </div>
                      )
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
