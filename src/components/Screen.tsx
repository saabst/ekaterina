import type { ReactNode } from "react";

interface ScreenProps {
  image?: string;
  scroll?: boolean;
  children: ReactNode;
}

/** Полноэкранный каркас: фон с затемнённым изображением и колонка контента на всю высоту экрана. */
export default function Screen({ image, scroll = false, children }: ScreenProps) {
  return (
    <div
      className={`relative h-dvh w-full bg-[#0d0a1f] text-white ${
        scroll ? "overflow-y-auto" : "overflow-hidden"
      }`}
    >
      {image && (
        <>
          <img
            src={image}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full scale-105 object-cover opacity-30 blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0a1f]/85 via-[#1a1033]/92 to-[#0d0a1f]" />
        </>
      )}
      <div className="relative flex h-full min-h-0 w-full flex-col">{children}</div>
    </div>
  );
}
