import React from "react";

const BIRTHDAY_APP_URL =
  process.env.NEXT_PUBLIC_BIRTHDAY_APP_URL ||
  "https://um-birthday-photos.vercel.app";

export default function BirthdayPage() {
  return (
    <div className="w-full h-[calc(100vh-10rem)] min-h-[calc(100vh-10rem)] bg-black">
      <iframe
        title="Unicorn Mafia Birthday"
        src={BIRTHDAY_APP_URL}
        className="w-full h-full border-0"
        allow="camera *; microphone *; clipboard-write *; fullscreen *"
      />
    </div>
  );
}

