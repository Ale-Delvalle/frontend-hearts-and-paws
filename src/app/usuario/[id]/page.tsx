import UsuarioPerfilPage from "@/components/componenstuser/UsuarioPerfilPage";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <UsuarioPerfilPage id={id} />;
}
