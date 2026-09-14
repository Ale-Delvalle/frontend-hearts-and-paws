import MascotaPerfilDetalle from "@/components/mascota/MascotaPerfilDetalle";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MascotaPerfilDetalle id={id} />;
}
