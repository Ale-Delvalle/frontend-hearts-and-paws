import OngPerfilPage from "@/components/components-ong/OngPerfilPage";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OngPerfilPage id={id} />;
}
