import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen flex justify-center items-center">
      <div>
        <h2 className="text-xl font-bold">404 Not Found</h2>
        <p>Could not find requested resource</p>
        <Link href="/" className="text-secondary font-medium underline">
          Return Home
        </Link>
      </div>
    </div>
  );
}
