import { Play, SkipForward, SkipBack } from "lucide-react";

const SpotifyWidget = () => {
  return (
    <div className="w-64 rounded-xl border border-white/10 bg-black/80 p-4 text-white shadow-xl backdrop-blur-md select-none">
      <div className="mb-3 flex items-center gap-4">
        {/* Album Art Placeholder */}
        <div className="h-12 w-12 rounded-md bg-linear-to-br from-green-400 to-blue-500 shadow-inner" />
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-bold">Creative Code</h4>
          <p className="truncate text-xs text-gray-400">Tingxuan Wu</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3 h-1 w-full overflow-hidden rounded-full bg-gray-600">
        <div className="h-full w-1/3 rounded-full bg-green-500" />
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 text-gray-300">
        <SkipBack size={20} className="cursor-pointer hover:text-white" />
        <Play
          size={20}
          className="cursor-pointer fill-current hover:text-white"
        />
        <SkipForward size={20} className="cursor-pointer hover:text-white" />
      </div>
    </div>
  );
};

export default SpotifyWidget;
