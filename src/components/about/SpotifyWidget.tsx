import { Play, SkipForward, SkipBack } from 'lucide-react';

const SpotifyWidget = () => {
  return (
    <div className="bg-black/80 backdrop-blur-md text-white p-4 rounded-xl shadow-xl w-64 border border-white/10 select-none">
      <div className="flex gap-4 items-center mb-3">
        {/* Album Art Placeholder */}
        <div className="w-12 h-12 bg-linear-to-br from-green-400 to-blue-500 rounded-md shadow-inner" />
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm truncate">Creative Code</h4>
          <p className="text-xs text-gray-400 truncate">Tingxuan Wu</p>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-600 rounded-full mb-3 overflow-hidden">
        <div className="w-1/3 h-full bg-green-500 rounded-full" />
      </div>
      
      {/* Controls */}
      <div className="flex justify-center gap-4 text-gray-300">
        <SkipBack size={20} className="hover:text-white cursor-pointer" />
        <Play size={20} className="hover:text-white cursor-pointer fill-current" />
        <SkipForward size={20} className="hover:text-white cursor-pointer" />
      </div>
    </div>
  );
}

export default SpotifyWidget;