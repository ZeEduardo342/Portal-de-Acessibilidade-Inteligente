import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { Heart, Brain, Users, BarChart3, MessageSquare, FileText } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();

  if (isAuthenticated && user) {
    // Redirecionar para dashboard baseado no perfil
    if (user.role === "admin" || user.role === "gestor") {
      navigate("/dashboard");
    } else {
      navigate("/demandas");
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="border-b border-gold/20 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gold to-navy rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Portal de Acessibilidade</h1>
          </div>
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            className="btn-primary"
          >
            Entrar
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Decoração de fundo com espiral áurea */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/3 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-8 animate-fade-in">
            <h2 className="text-5xl font-bold text-foreground mb-6 leading-tight">
              Transformando a Acessibilidade em Ação
            </h2>
            <p className="text-xl text-foreground/70 mb-8 leading-relaxed font-serif">
              Uma plataforma inteligente que centraliza demandas de acessibilidade, 
              conecta áreas e promove inclusão efetiva no ambiente corporativo.
            </p>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              onClick={() => (window.location.href = getLoginUrl())}
              className="btn-primary text-lg px-8 py-3"
            >
              Começar Agora
            </Button>
            <Button
              onClick={() => navigate("/conhecimento")}
              className="btn-secondary text-lg px-8 py-3"
            >
              Saiba Mais
            </Button>
          </div>
        </div>
      </section>

      {/* Divisor decorativo */}
      <div className="divider-gold" />

      {/* Funcionalidades */}
      <section className="py-20 px-4 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-4xl font-bold text-center text-foreground mb-16">
            Funcionalidades Principais
          </h3>

          <div className="demands-grid">
            {/* Card 1: Cadastro de Demandas */}
            <div className="card-elegant group">
              <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                <FileText className="w-6 h-6 text-gold" />
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-3">Cadastro de Demandas</h4>
              <p className="text-foreground/70 font-serif">
                Registre solicitações de acessibilidade de forma simples e centralizada, 
                com classificação automática por IA.
              </p>
            </div>

            {/* Card 2: Chatbot Inteligente */}
            <div className="card-elegant group">
              <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                <MessageSquare className="w-6 h-6 text-gold" />
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-3">Chatbot Inteligente</h4>
              <p className="text-foreground/70 font-serif">
                Obtenha orientações imediatas, tire dúvidas sobre direitos e 
                receba recomendações personalizadas.
              </p>
            </div>

            {/* Card 3: Avaliação Ergonômica */}
            <div className="card-elegant group">
              <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                <Brain className="w-6 h-6 text-gold" />
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-3">Avaliação Ergonômica</h4>
              <p className="text-foreground/70 font-serif">
                Formulário estruturado com recomendações automáticas baseadas 
                em normas ABNT e melhores práticas.
              </p>
            </div>

            {/* Card 4: Base de Conhecimento */}
            <div className="card-elegant group">
              <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                <Users className="w-6 h-6 text-gold" />
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-3">Base de Conhecimento</h4>
              <p className="text-foreground/70 font-serif">
                Acesse artigos, normas (ABNT, Lei Brasileira de Inclusão) 
                e boas práticas de acessibilidade.
              </p>
            </div>

            {/* Card 5: Gestão Integrada */}
            <div className="card-elegant group">
              <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                <Heart className="w-6 h-6 text-gold" />
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-3">Gestão Integrada</h4>
              <p className="text-foreground/70 font-serif">
                Encaminhamento automático entre áreas (RH, Saúde, TI, Ergonomia, Facilities) 
                com notificações em tempo real.
              </p>
            </div>

            {/* Card 6: Relatórios e Dados */}
            <div className="card-elegant group">
              <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                <BarChart3 className="w-6 h-6 text-gold" />
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-3">Relatórios Estratégicos</h4>
              <p className="text-foreground/70 font-serif">
                Métricas consolidadas, análise de tendências e exportação de dados 
                para decisões informadas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divisor decorativo */}
      <div className="divider-gold" />

      {/* Benefícios */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h3 className="text-4xl font-bold text-center text-foreground mb-16">
            Por que usar o Portal?
          </h3>

          <div className="space-y-6">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-gold font-bold">✓</span>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-foreground mb-2">Inclusão Efetiva</h4>
                <p className="text-foreground/70 font-serif">
                  Promove uma abordagem integrada que vai além da superficialidade, 
                  removendo barreiras reais e atitudinais.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-gold font-bold">✓</span>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-foreground mb-2">Agilidade Operacional</h4>
                <p className="text-foreground/70 font-serif">
                  Reduz tempo de resposta, elimina retrabalho e garante 
                  encaminhamento estruturado das demandas.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-gold font-bold">✓</span>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-foreground mb-2">Inteligência Organizacional</h4>
                <p className="text-foreground/70 font-serif">
                  Centraliza conhecimento, identifica padrões e reutiliza soluções 
                  já testadas em diferentes áreas.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-gold font-bold">✓</span>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-foreground mb-2">Conformidade Normativa</h4>
                <p className="text-foreground/70 font-serif">
                  Alinhado com ABNT, Lei Brasileira de Inclusão e boas práticas 
                  internacionais de acessibilidade.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divisor decorativo */}
      <div className="divider-gold" />

      {/* CTA Final */}
      <section className="py-20 px-4 bg-secondary text-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h3 className="text-4xl font-bold mb-6">Comece sua Jornada de Inclusão</h3>
          <p className="text-lg mb-8 opacity-90 font-serif">
            Junte-se a organizações que estão transformando a acessibilidade 
            em uma vantagem competitiva.
          </p>
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            className="bg-gold text-foreground hover:bg-gold/90 font-semibold px-8 py-3 text-lg"
          >
            Entrar Agora
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gold/20 py-8 px-4">
        <div className="container mx-auto text-center text-foreground/60 font-serif">
          <p>Portal de Acessibilidade Inteligente © 2026 | Desenvolvido com ❤️ para inclusão</p>
        </div>
      </footer>
    </div>
  );
}
