import HeroDynamic from '@/components/HeroDynamic';
import Trabajos from '@/components/Trabajos';
import SobreMi from '@/components/SobreMi';
import Certificaciones from '@/components/Certificaciones';
import Servicios from '@/components/Servicios';
import Contacto from '@/components/Contacto';

export default function HomePage() {
  return (
    <main id="main" role="main">
      <HeroDynamic />
      <Trabajos />
      <SobreMi />
      <Certificaciones />
      <Servicios />
      <Contacto />
    </main>
  );
}
