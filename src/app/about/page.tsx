"use client";

import WindowFrame from "@/components/WindowFrame";
import Palette from "@/components/about/Palette";

const AboutApp = () => {
  return (
    <WindowFrame id="about" title="About_Me.can">
      <div className="h-full">
        <Palette />
      </div>
    </WindowFrame>
  );
};

export default AboutApp;
