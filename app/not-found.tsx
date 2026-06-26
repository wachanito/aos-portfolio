import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="notfound">
      <div className="notfound__inner">
        <span className="notfound__code">404</span>
        <h1 className="notfound__title">Página no<br /><span className="notfound__accent">encontrada.</span></h1>
        <p className="notfound__body">La URL que buscas no existe o fue movida.</p>
        <Link href="/" className="notfound__cta">
          <span className="arr" aria-hidden="true">&#8592;</span> Volver al inicio
        </Link>
      </div>
    </main>
  );
}
