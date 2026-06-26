import { notFound } from 'next/navigation';
import { proyectos, getProyecto } from '@/data/proyectos';
import ProyectoClient from '@/components/ProyectoClient';

export async function generateStaticParams() {
  return proyectos.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProyecto(slug);
  return { title: p ? `${p.titulo} — AOS Portfolio` : 'Proyecto' };
}

export default async function ProyectoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const proyecto = getProyecto(slug);
  if (!proyecto) notFound();

  const all = proyectos;
  const idx = all.findIndex(p => p.slug === slug);
  const prev = all[(idx - 1 + all.length) % all.length];
  const next = all[(idx + 1) % all.length];

  return <ProyectoClient proyecto={proyecto} prev={prev} next={next} />;
}
