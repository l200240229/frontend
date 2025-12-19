export default function TalentSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gradient-to-r from-blue-300 to-indigo-300 h-40 rounded-t-xl" />

      <div className="p-6 space-y-6 bg-white rounded-b-xl">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gray-300 rounded-full" />
          <div className="space-y-2">
            <div className="h-5 w-40 bg-gray-300 rounded" />
            <div className="h-4 w-28 bg-gray-200 rounded" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-5/6 bg-gray-200 rounded" />
          <div className="h-4 w-4/6 bg-gray-200 rounded" />
        </div>

        <div className="flex gap-2">
          <div className="h-8 w-20 bg-gray-200 rounded-full" />
          <div className="h-8 w-24 bg-gray-200 rounded-full" />
          <div className="h-8 w-16 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}