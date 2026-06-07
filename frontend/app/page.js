export default function Home() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="bg-white border border-gray-200 rounded-3xl shadow-2xl p-10">

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">
                C
              </span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black">
              Chat Assignment
            </h1>

            <p className="text-gray-600 mt-3">
              Real-Time Chat Application
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-4">

            <a
              href="/register"
              className="w-full h-12 bg-black hover:bg-gray-900 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center"
            >
              Create Account
            </a>

            <a
              href="/login"
              className="w-full h-12 border border-gray-300 bg-white hover:bg-gray-50 text-black rounded-xl font-semibold transition-all duration-300 flex items-center justify-center"
            >
              Sign In
            </a>

          </div>

        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Built with Next.js & Express
        </p>

      </div>
    </div>
  );
}