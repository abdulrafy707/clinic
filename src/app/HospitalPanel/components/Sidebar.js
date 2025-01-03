import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-800 text-white fixed">
      <div className="p-6">
        <h2 className="text-2xl font-semibold">Hospital Panel</h2>
      </div>
      <nav className="mt-6">
        <Link href="/HospitalPanel/dashboard" className="block px-6 py-2 hover:bg-gray-700">
          Dashboard
        </Link>
        <Link href="/HospitalPanel/doctors" className="block px-6 py-2 hover:bg-gray-700">
          Doctors
        </Link>
        <Link href="/patients" className="block px-6 py-2 hover:bg-gray-700">
          Patients
        </Link>
        <Link href="/templates" className="block px-6 py-2 hover:bg-gray-700">
          Templates
        </Link>
        <Link href="/settings" className="block px-6 py-2 hover:bg-gray-700">
          Settings
        </Link>
      </nav>
    </aside>
  );
}
