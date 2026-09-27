import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatCHF, formatEventDate } from "@/lib/format";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default async function ConfirmacaoPage({
  params,
}: {
  params: Promise<{ slug: string; registrationId: string }>;
}) {
  const { registrationId } = await params;
  const supabase = createAdminClient();

  const [{ data: registration }, paymentInfo] = await Promise.all([
    supabase.from("registrations").select("*, events(*)").eq("id", registrationId).maybeSingle(),
    getSiteSettings(),
  ]);

  if (!registration) notFound();

  const event = (registration as unknown as { events: { name: string; price_chf: number } })
    .events;
  const isPaid = event.price_chf > 0;

  return (
    <div className="mx-auto max-w-lg px-6 py-20">
      <p className="font-script text-2xl text-accent">inscrição recebida</p>
      <h1 className="mt-2 font-sans font-semibold text-3xl">Obrigado, {registration.name.split(" ")[0]}!</h1>
      <p className="mt-4 text-muted">
        {isPaid ? (
          <>
            Sua vaga para <strong className="text-foreground">{event.name}</strong> está
            reservada. Para garantir a vaga, complete o pagamento até a data
            abaixo.
          </>
        ) : (
          <>
            Sua presença em <strong className="text-foreground">{event.name}</strong> está
            confirmada. Até lá!
          </>
        )}
      </p>

      <div className="mt-10 rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Valor</span>
          <span className="font-medium">
            {isPaid ? formatCHF(event.price_chf) : "Gratuito"}
          </span>
        </div>
        {isPaid && (
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-muted">Pagar até</span>
            <span className="font-medium text-accent">
              {formatEventDate(registration.expires_at)}
            </span>
          </div>
        )}

        {isPaid && (
          <div className="mt-6 border-t border-border pt-6 text-sm">
            <p className="text-muted mb-2">Dados para pagamento (Twint)</p>
            <p>Twint: {paymentInfo.twint_number}</p>
            <p>Titular: {paymentInfo.account_holder}</p>
            <p>IBAN: {paymentInfo.iban}</p>
            <p className="mt-3 text-xs text-muted">{paymentInfo.payment_notes}</p>
          </div>
        )}
      </div>

      <p className="mt-8 text-sm text-muted">
        Um e-mail de confirmação não é enviado automaticamente — guarde esta
        página ou uma captura de tela como comprovante da sua reserva.
      </p>

      <Link href="/eventos" className="mt-10 inline-block text-sm text-accent">
        ← voltar para eventos
      </Link>
    </div>
  );
}
