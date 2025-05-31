"use client";
import React, { useState } from "react";
import { createSurvey, Rating } from "./surveyService";

const likertOptions: { label: string; value: Rating }[] = [
  { label: "Strongly Agree", value: "StronglyAgree" },
  { label: "Agree", value: "Agree" },
  { label: "Neutral", value: "Neutral" },
  { label: "Disagree", value: "Disagree" },
  { label: "Strongly Disagree", value: "StronglyDisagree" },
];

export default function Home() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [favoriteFood, setFavoriteFood] = useState<string[]>([]);
  const likertStatements = [
    "I like to watch movies",
    "I like to listen to radio",
    "I like to eat out",
    "I like to watch  TV",
  ];
  const [ratings, setRatings] = useState<Record<string, Rating>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const foodOptions = ["Pizza", "Pasta", "Pap and Wors", "Other"];

  const handleFoodChange = (food: string) => {
    setFavoriteFood((prev) =>
      prev.includes(food) ? prev.filter((f) => f !== food) : [...prev, food]
    );
  };

  const handleLikertChange = (statement: string, value: Rating) => {
    setRatings((prev) => ({ ...prev, [statement]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);
    try {
      await createSurvey({
        fullName,
        email,
        dateOfBirth,
        contactNumber,
        favoriteFood,
        ratings,
      });
      setSuccess(true);
      setFullName("");
      setEmail("");
      setDateOfBirth("");
      setContactNumber("");
      setFavoriteFood([]);
      setRatings({});
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "40px auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Tshimologong Digital Assessment</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 8,
          boxShadow: "0 2px 8px #eee",
        }}
      >
        <div style={{ display: "flex", marginBottom: 16 }}>
          <label
            style={{ width: 140, marginRight: 8, alignSelf: "flex-start" }}
          >
            Personal Details :
          </label>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 8 }}>
              <input
                type="text"
                placeholder="Full Names"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{ width: "100%", padding: 6, marginBottom: 8 }}
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", padding: 6, marginBottom: 8 }}
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <input
                type="date"
                placeholder="Date of Birth"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                style={{ width: "100%", padding: 6, marginBottom: 8 }}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Contact Number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                style={{ width: "100%", padding: 6 }}
              />
            </div>
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8 }}>What is your favorite food?</div>
          {foodOptions.map((food) => (
            <label key={food} style={{ marginRight: 16 }}>
              <input
                type="checkbox"
                checked={favoriteFood.includes(food)}
                onChange={() => handleFoodChange(food)}
              />
              {food}
            </label>
          ))}
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8 }}>
            Please rate your level of agreement on a scale from 1 to 5, with 1
            being &quot;strongly agree&quot; and 5 being &quot;strongly
            disagree.&quot;
          </div>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: 16,
            }}
          >
            <thead>
              <tr style={{ background: "#f5f5f5" }}>
                <th style={{ border: "1px solid #ccc", padding: 6 }}></th>
                {likertOptions.map((opt) => (
                  <th
                    key={opt.value}
                    style={{ border: "1px solid #ccc", padding: 6 }}
                  >
                    {opt.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {likertStatements.map((statement, idx) => (
                <tr key={idx}>
                  <td style={{ border: "1px solid #ccc", padding: 6 }}>
                    {statement}
                  </td>
                  {likertOptions.map((opt) => (
                    <td
                      key={opt.value}
                      style={{ border: "1px solid #ccc", textAlign: "center" }}
                    >
                      <input
                        type="radio"
                        name={`likert-${idx}`}
                        value={opt.value}
                        checked={ratings[statement] === opt.value}
                        onChange={() =>
                          handleLikertChange(statement, opt.value)
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
        {success && (
          <div style={{ color: "green", marginBottom: 8 }}>
            Survey submitted successfully!
          </div>
        )}
        <div style={{ textAlign: "center" }}>
          <button
            type="submit"
            disabled={submitting}
            style={{
              background: "#4da3ff",
              color: "#fff",
              border: "none",
              padding: "10px 32px",
              borderRadius: 4,
              fontWeight: 600,
              fontSize: 16,
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Submitting..." : "SUBMIT"}
          </button>
        </div>
      </form>
    </div>
  );
}
