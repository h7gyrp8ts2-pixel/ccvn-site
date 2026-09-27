import Image from "next/image";

// Logo oficial da CCVN: "mark" é o selo circular (cabeçalho/rodapé), e
// "wordmark" é a lockup vertical usada em destaque (hero da home). As
// imagens têm fundo branco puro; mix-blend-mode: multiply as funde com o
// fundo levemente bege do site sem precisar de um PNG com transparência.
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
      src="/logo/mark.webp"
      alt="Comunidade Cristã Vida Nova — CCVN Schweiz"
      width={80}
      height={80}
      className={`w-9 h-9 mix-blend-multiply ${className}`}
    />
  );
}
