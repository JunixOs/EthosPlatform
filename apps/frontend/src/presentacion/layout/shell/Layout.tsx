import { Outlet } from 'react-router-dom';
import { Navbar } from '@layout/header/Navbar';
import { ErrorToastContainer } from '@shared/components/ErrorToast/ErrorToast.component';

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Navbar />
      <ErrorToastContainer />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
