import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Services />

      {/* Visual Break / CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="glass p-12 rounded-3xl text-center relative z-10 overflow-hidden border-2 border-accent/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -ml-32 -mb-32" />

            <h2 className="text-3xl md:text-5xl font-bold mb-6">Pronto para transformar sua <br /> <span className="text-gradient">gestão tributária?</span></h2>
            <p className="text-foreground/60 mb-10 max-w-xl mx-auto">
              Nossa equipe está preparada para realizar um diagnóstico completo e identificar oportunidades imediatas de economia para sua empresa.
            </p>
            <button className="px-10 py-5 bg-accent hover:bg-accent-light text-primary font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-accent/20">
              Solicitar Diagnóstico Gratuito
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
