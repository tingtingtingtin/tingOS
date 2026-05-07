interface DesktopColorColumnProps {
  colors: string[];
  currentColor: string;
  onColorSelect: (color: string) => void;
  onModeChange: (mode: "brush") => void;
}

export const DesktopColorColumn = ({
  colors,
  currentColor,
  onColorSelect,
  onModeChange,
}: DesktopColorColumnProps) => {
  return (
    <div className="hidden flex-col gap-3 overflow-visible px-0 md:flex">
      {colors.map((c) => (
        <button
          key={c}
          onClick={() => {
            onColorSelect(c);
            onModeChange("brush");
          }}
          className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 hover:cursor-pointer ${currentColor === c ? "scale-110 border-gray-400 shadow-md" : "border-transparent"}`}
          style={{ backgroundColor: c }}
          title={c}
        />
      ))}
      <div className="my-2 h-px w-8 bg-gray-300 dark:bg-gray-700" />
    </div>
  );
};
