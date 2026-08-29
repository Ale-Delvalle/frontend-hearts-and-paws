import MascotaPerfilPage from "@/components/mascota/MascotaPerfilPage";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MascotaPerfilPage id={id} />;
}
