function FeatureCard({ icon, title, description, tag }) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 -rotate-1 rounded-2xl bg-gradient-to-tr from-gray-100 to-gray-200 shadow-xl transition-all duration-300 group-hover:scale-105"></div>
      <div className="absolute inset-0 rotate-1 rounded-2xl bg-gradient-to-tr from-blue-50 to-blue-100 shadow-xl transition-all duration-300 group-hover:scale-105"></div>
      <div className="relative bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 group-hover:shadow-2xl">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          {icon}
        </div>
        <h3 className="font-serif text-2xl font-medium text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
          {tag}
        </span>
      </div>
    </div>
  )
}
