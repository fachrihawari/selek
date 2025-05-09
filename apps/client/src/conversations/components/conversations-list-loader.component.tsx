export function ConversationsListLoader() {
  return (
    <div className="flex-1 p-4 space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="h-4 w-1/2 bg-orange-900/40 rounded mb-2"></div>
          <div className="space-y-1">
            <div className="h-3 w-3/4 bg-orange-900/30 rounded"></div>
            <div className="h-3 w-2/3 bg-orange-900/20 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

}