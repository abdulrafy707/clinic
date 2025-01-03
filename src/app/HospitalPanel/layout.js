// import '../styles/globals.css';
import NavBar from './components/NavBar';
import Sidebar from './components/Sidebar';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          <NavBar />
          <main className="p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
