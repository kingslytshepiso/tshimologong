import Link from "next/link";

export default function Header() {
  return (
    <div>
      <nav className="flex justify-between items-center p-4">
        <Link href="/" className="text-2xl font-bold">
          _Surveys
        </Link>
        <div className="flex gap-4">
          <Link href="/" className="text-blue-500">
            Fill out survey
          </Link>
          <Link href="/results">View Survey results</Link>
        </div>
      </nav>
    </div>
  );
}
