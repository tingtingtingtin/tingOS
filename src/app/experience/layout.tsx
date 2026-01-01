import WindowFrame from "@/components/WindowFrame";

export default function ExperienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WindowFrame id="experience" title="Xperiences">
      {children}
    </WindowFrame>
  );
}
