import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
      <header className="flex h-16 items-center justify-between px-4 md:px-8 border-b dark:border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Smart Film Prod
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Log in
          </Link>
          <Link href="/register" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors">
            Sign up
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-24 md:py-32 lg:py-48 flex items-center justify-center text-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-gray-900 dark:text-white">
                  Manage Production <br /> <span className="text-blue-600">Smarter.</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 mt-4">
                  The all-in-one platform for modern film production. Schedule scenes, manage crew, and track budgets seamlessly.
                </p>
              </div>
              <div className="space-x-4 mt-8">
                <Link href="/register" className="inline-flex h-12 items-center justify-center rounded-md bg-blue-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-blue-500">
                  Get Started
                </Link>
                <Link href="#features" className="inline-flex h-12 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-50 dark:hover:text-white">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t dark:border-gray-800 py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 md:px-8 text-center md:text-left">
          <p className="text-sm leading-loose text-gray-500 dark:text-gray-400">
            © 2026 Smart Film Production Management. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
