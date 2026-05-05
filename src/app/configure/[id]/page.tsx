import ConfigureForm from "./ConfigureForm";

export default async function ConfigurePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ConfigureForm generationId={id} />;
}
