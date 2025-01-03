import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-blue-500 text-white">
      <div>
        <Link href="/dashboard" className="text-xl font-bold">
          Hospital Panel
        </Link>
      </div>
      <div>
        <Link href="/doctors" className="mr-4">
          Doctors
        </Link>
        <Link href="/patients" className="mr-4">
          Patients
        </Link>
        <Link href="/settings">
          Settings
        </Link>
      </div>
    </nav>
  );
}
