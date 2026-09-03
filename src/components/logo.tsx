import Image from "next/image";

type Props = {
  variant?: "mark" | "lockup";
  invert?: boolean;
  className?: string;
  priority?: boolean;
};

export function Logo({
  variant = "mark",
  invert = false,
  className = "",
  priority = false,
}: Props) {
  const src =
    variant === "lockup"
      ? invert
        ? "/sayari-logo-light.png"
        : "/sayari-logo.png"
      : invert
        ? "/sayari-mark-light.png"
        : "/sayari-mark.png";

  return (
    <Image
      src={src}
      alt="Sayari"
      width={variant === "lockup" ? 480 : 220}
      height={variant === "lockup" ? 516 : 114}
      priority={priority}
      className={`h-auto w-auto ${className}`}
    />
  );
}
