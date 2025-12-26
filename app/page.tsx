import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center justify-items-center">
      <div className="text-center pb-5">Register</div>
      <div className="text-center">
        <label htmlFor="Fullname mb-5" className="mr-4">
          Fullname
        </label>
        <input type="text" />
      </div>
      <div className="text-center">
        <label htmlFor="Fullname" className="mr-4">
          Fullname
        </label>
        <input type="text" />
      </div>
      <div className="text-center">
        <label htmlFor="Fullname" className="mr-4">
          Fullname
        </label>
        <input type="text" />
      </div>
    </main>
  );
}
