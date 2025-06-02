"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { createSurvey, Rating } from "./surveyService";

const likertOptions: { label: string; value: Rating }[] = [
  { label: "Strongly Agree", value: "StronglyAgree" },
  { label: "Agree", value: "Agree" },
  { label: "Neutral", value: "Neutral" },
  { label: "Disagree", value: "Disagree" },
  { label: "Strongly Disagree", value: "StronglyDisagree" },
];

const foodOptions = ["Pizza", "Pasta", "Pap and Wors", "Other"];
const likertStatements = [
  "I like to watch movies",
  "I like to listen to radio",
  "I like to eat out",
  "I like to watch  TV",
];

const schema = yup.object({
  fullName: yup.string().required("Full Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  dateOfBirth: yup.string().required("Date of Birth is required"),
  contactNumber: yup.string().required("Contact Number is required"),
  favoriteFood: yup
    .array()
    .of(yup.string().required())
    .min(1, "Select at least one food")
    .required(),
  ratings: yup
    .object()
    .test(
      "all-rated",
      "Please rate all statements",
      (value: Record<string, Rating> | undefined) =>
        value &&
        likertStatements.every(
          (statement) => value[statement] && value[statement].length > 0
        )
    )
    .required(),
});

type FormData = {
  fullName: string;
  email: string;
  dateOfBirth: string;
  contactNumber: string;
  favoriteFood: string[];
  ratings: Record<string, Rating>;
};

export default function Home() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      dateOfBirth: "",
      contactNumber: "",
      favoriteFood: [],
      ratings: {},
    },
  });
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  const onSubmit = async (data: FormData) => {
    setError("");
    setSuccess(false);
    try {
      await createSurvey(data);
      setSuccess(true);
      reset();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submission failed");
    }
  };

  // For checkboxes
  const favoriteFood = watch("favoriteFood");
  // For ratings
  const ratings = watch("ratings");

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
        onSubmit={handleSubmit(onSubmit)}
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 8,
          boxShadow: "0 2px 8px #eee",
        }}
        noValidate
      >
        <div style={{ display: "flex", marginBottom: 16 }}>
          <div style={{ width: 140, marginRight: 8, alignSelf: "flex-start" }}>
            <span style={{ fontWeight: 600 }}>Personal Details :</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 8 }}>
              <label
                htmlFor="fullName"
                style={{ display: "block", marginBottom: 2 }}
              >
                Full Names:
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Full Names"
                {...register("fullName")}
                style={{ width: "100%", padding: 6, marginBottom: 2 }}
              />
              {errors.fullName && (
                <div style={{ color: "red" }}>
                  {String(errors.fullName.message)}
                </div>
              )}
            </div>
            <div style={{ marginBottom: 8 }}>
              <label
                htmlFor="email"
                style={{ display: "block", marginBottom: 2 }}
              >
                Email:
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                {...register("email")}
                style={{ width: "100%", padding: 6, marginBottom: 2 }}
              />
              {errors.email && (
                <div style={{ color: "red" }}>
                  {String(errors.email.message)}
                </div>
              )}
            </div>
            <div style={{ marginBottom: 8 }}>
              <label
                htmlFor="dateOfBirth"
                style={{ display: "block", marginBottom: 2 }}
              >
                Date of Birth:
              </label>
              <input
                id="dateOfBirth"
                type="date"
                placeholder="Date of Birth"
                {...register("dateOfBirth")}
                style={{ width: "100%", padding: 6, marginBottom: 2 }}
              />
              {errors.dateOfBirth && (
                <div style={{ color: "red" }}>
                  {String(errors.dateOfBirth.message)}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="contactNumber"
                style={{ display: "block", marginBottom: 2 }}
              >
                Contact Number:
              </label>
              <input
                id="contactNumber"
                type="text"
                placeholder="Contact Number"
                {...register("contactNumber")}
                style={{ width: "100%", padding: 6, marginBottom: 2 }}
              />
              {errors.contactNumber && (
                <div style={{ color: "red" }}>
                  {String(errors.contactNumber.message)}
                </div>
              )}
            </div>
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8 }}>What is your favorite food?</div>
          {foodOptions.map((food) => (
            <label key={food} style={{ marginRight: 16 }}>
              <input
                type="checkbox"
                value={food}
                checked={favoriteFood?.includes(food)}
                onChange={(e) => {
                  const checked = e.target.checked;
                  if (checked) {
                    setValue("favoriteFood", [...(favoriteFood || []), food]);
                  } else {
                    setValue(
                      "favoriteFood",
                      (favoriteFood || []).filter((f: string) => f !== food)
                    );
                  }
                }}
              />
              {food}
            </label>
          ))}
          {errors.favoriteFood && (
            <div style={{ color: "red" }}>
              {String(errors.favoriteFood.message)}
            </div>
          )}
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
                        checked={ratings?.[statement] === opt.value}
                        onChange={() => {
                          setValue(`ratings.${statement}`, opt.value, {
                            shouldValidate: true,
                          });
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {errors.ratings && (
            <div style={{ color: "red" }}>{String(errors.ratings.message)}</div>
          )}
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
            disabled={isSubmitting}
            style={{
              background: "#4da3ff",
              color: "#fff",
              border: "none",
              padding: "10px 32px",
              borderRadius: 4,
              fontWeight: 600,
              fontSize: 16,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting ? "Submitting..." : "SUBMIT"}
          </button>
        </div>
      </form>
    </div>
  );
}
