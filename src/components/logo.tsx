import Image from "next/image";

// "mark" é o selo circular (PNG com fundo transparente, usado no cabeçalho);
// "wordmark" é a lockup vertical do hero. O wordmark ainda é um JPG com fundo
// branco, então mix-blend-mode: multiply o funde com o fundo bege do site.
export function Logo({
  variant = "mark",
  className = "",
}: {
  variant?: "mark" | "wordmark";
  className?: string;
}) {
  if (variant === "wordmark") {
    return (
      <Image
        src="/logo/wordmark.jpg"
        alt="Comunidade Cristã Vida Nova"
        width={320}
        height={320}
        className={`w-40 h-auto md:w-48 mix-blend-multiply ${className}`}
        priority
      />
    );
  }

  return (
    <Image
      src="/logo/mark.png"
      alt="Comunidade Cristã Vida Nova — CCVN Schweiz"
      width={127}
      height={128}
      className={`w-9 h-9 ${className}`}
    />
  );
}
