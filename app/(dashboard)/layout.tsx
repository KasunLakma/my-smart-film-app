import Link from 'next/link'
import { ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-gray-100 dark:bg-gray-900">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="p-4 border-b dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Smart Film Prod</h1>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/" className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
            Dashboard
          </Link>
          <Link href="#" className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
            Projects
          </Link>
          <Link href="#" className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
            Cast & Crew
          </Link>
          <Link href="#" className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
            Schedule
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8 pb-4 border-b dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Overview</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">Welcome, User</span>
            <Link href="/login" className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 transition-colors">
              Logout
            </Link>
          </div>
        </header>
        {children}
      </main>
    </div>
  )
}
