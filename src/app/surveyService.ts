// Define the Survey interface for type safety
export type Rating =
  | "StronglyAgree"
  | "Agree"
  | "Neutral"
  | "Disagree"
  | "StronglyDisagree";

export interface Survey {
  id?: string;
  fullName: string;
  email: string;
  dateOfBirth: string; // ISO string
  contactNumber: string;
  favoriteFood: string[];
  ratings: Record<string, Rating>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createSurvey(data: Survey) {
  const response = await fetch(`${API_URL}/surveys`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create survey");
  }
  return response.json();
}

export async function fetchSurveys() {
  const response = await fetch(`${API_URL}/surveys`);
  if (!response.ok) {
    throw new Error("Failed to fetch surveys");
  }
  return response.json();
}
