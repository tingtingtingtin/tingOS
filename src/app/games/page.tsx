
import GamesConsole from "@/components/games/GamesConsole";
import WindowFrame from "@/components/WindowFrame";

const GamesApp = () => {
  return (
    <WindowFrame id="games" title="Arcade">
      <div className="w-full h-full">
        <GamesConsole />
      </div>
    </WindowFrame>
  );
};

export default GamesApp;
