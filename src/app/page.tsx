import { redirect } from "next/navigation";

/** Home is temporarily disabled — focus on hackathons (`/h`). */
export default function Home() {
  redirect("/h");
}
