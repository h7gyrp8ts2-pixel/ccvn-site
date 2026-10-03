import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <Link href="/admin" className="font-medium">
            Admin
          </Link>
          <Link href="/admin/eventos" className="text-muted hover:text-foreground">
            Eventos
          </Link>
          <Link href="/admin/avisos" className="text-muted hover:text-foreground">
            Avisos
          </Link>
          <Link href="/admin/conteudo" className="text-muted hover:text-foreground">
            Conteúdo
          </Link>
          <Link href="/admin/ministerios" className="text-muted hover:text-foreground">
            Ministérios
          </Link>
          <Link href="/admin/galeria" className="text-muted hover:text-foreground">
            Galeria
          </Link>
          <Link href="/admin/oracoes" className="text-muted hover:text-foreground">
            Orações
          </Link>
          <Link href="/admin/configuracoes" className="text-muted hover:text-foreground">
            Configurações
          </Link>
        </nav>
        <form action={logoutAction}>
          <button type="submit" className="text-sm text-muted hover:text-foreground">
            Sair
          </button>
        </form>
      </div>
      <div className="pt-8">{children}</div>
    </div>
  );
}
