import { MonitorX } from "lucide-react";

interface TitleAreaProps {
  title: string;
  description: string;
  isUnsupported: boolean;
}

const TitleArea = ({ title, description, isUnsupported }: TitleAreaProps) => {
  return (
    <div className="relative z-20 mb-2 flex flex-col text-left md:mb-8 md:ml-[15%] md:items-start md:pt-4">
      <div className="mx-auto flex gap-4 md:mx-0 md:justify-start">
        <div className="hidden h-6 w-1 rounded-full bg-[#00C3E3] md:ml-0 md:block" />
        <h2 className="text-xl font-medium text-[#00C3E3] md:text-2xl">
          {title}
          {/* Mobile Warning Badge */}
          {isUnsupported && (
            <span className="ml-2 inline-flex items-center gap-2 rounded px-2 py-1 text-sm font-black tracking-tighter text-red-500 uppercase">
              <MonitorX size={14} aria-label="desktop only" />
              <span className="sr-only">desktop only</span>
            </span>
          )}
        </h2>
      </div>
      <p className="mx-auto mt-2 min-h-12 w-2/3 text-center text-xs font-bold tracking-widest text-gray-400 uppercase md:ml-3 md:min-h-2 md:text-left">
        {description}
      </p>
    </div>
  );
};

export default TitleArea;
