export default function DashboardPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Quick Stats Cards */}
      <div className="rounded-xl border bg-white dark:bg-gray-800 p-6 shadow-sm dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Projects</h3>
        <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">12</p>
      </div>
      <div className="rounded-xl border bg-white dark:bg-gray-800 p-6 shadow-sm dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Crew</h3>
        <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">48</p>
      </div>
      <div className="rounded-xl border bg-white dark:bg-gray-800 p-6 shadow-sm dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Upcoming Scenes</h3>
        <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">5</p>
      </div>
      <div className="rounded-xl border bg-white dark:bg-gray-800 p-6 shadow-sm dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Budget Spent</h3>
        <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">64%</p>
      </div>

      {/* Recent Activity Section */}
      <div className="col-span-full md:col-span-2 lg:col-span-4 rounded-xl border bg-white dark:bg-gray-800 p-6 shadow-sm dark:border-gray-700 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="h-2 w-2 rounded-full bg-blue-500 mr-3"></div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Director Sarah</span> updated the shooting schedule for "Scene 4".
            </p>
          </div>
          <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="h-2 w-2 rounded-full bg-green-500 mr-3"></div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Camera Dept</span> checked out equipment for location A.
            </p>
          </div>
          <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="h-2 w-2 rounded-full bg-yellow-500 mr-3"></div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Production Manager</span> approved the catering budget.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
