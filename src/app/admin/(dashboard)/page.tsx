import Link from "next/link";

const cards = [
  { href: "/admin/eventos", title: "Eventos", description: "Criar, editar e ver inscritos de cada evento." },
  { href: "/admin/avisos", title: "Avisos", description: "Publicar flyers de atividades ou eventos externos, sem inscrição." },
  { href: "/admin/conteudo", title: "Conteúdo", description: "Editar o hero da home, o texto de Sobre e as fotos da página." },
  { href: "/admin/ministerios", title: "Ministérios", description: "Adicionar, editar, remover e colocar foto de cada ministério." },
  { href: "/admin/galeria", title: "Galeria", description: "Adicionar ou remover fotos da galeria pública." },
  { href: "/admin/oracoes", title: "Orações", description: "Ver e apagar os pedidos de oração enviados pelo site." },
  { href: "/admin/configuracoes", title: "Configurações", description: "Endereço, redes sociais e dados de pagamento." },
];

export default function AdminHomePage() {
  return (
    <div>
      <h1 className="font-serif text-2xl">Painel administrativo</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-border p-6 hover:border-foreground/30"
          >
            <h2 className="font-medium">{card.title}</h2>
            <p className="mt-1 text-sm text-muted">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
