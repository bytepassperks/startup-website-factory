import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import EditForm from "./EditForm";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gen = await prisma.generation.findUnique({ where: { id } });
  if (!gen) notFound();

  return (
    <EditForm
      generation={{
        id: gen.id,
        startupName: gen.startupName,
        tagline: gen.tagline,
        founderName: gen.founderName,
        founderBio: gen.founderBio,
        domainSuggestion: gen.domainSuggestion,
        heroHeadline: gen.heroHeadline,
        heroSubheadline: gen.heroSubheadline,
        founderEmailPattern: gen.founderEmailPattern,
      }}
    />
  );
}
