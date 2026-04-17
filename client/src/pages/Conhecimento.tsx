import { useState } from "react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Search, BookOpen, FileText, Scale, Lightbulb } from "lucide-react";

export default function Conhecimento() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: articles = [] } = trpc.knowledge.list.useQuery({
    limit: 100,
    offset: 0,
  });

  const categories = [
    { id: "norma_abnt", label: "Normas ABNT", icon: Scale },
    { id: "lei_brasileira_inclusao", label: "Lei Brasileira de Inclusão", icon: FileText },
    { id: "boa_prática", label: "Boas Práticas", icon: Lightbulb },
    { id: "guia", label: "Guias", icon: BookOpen },
  ];

  const filteredArticles = articles.filter((article: any) => {
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-primary/20 shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Base de Conhecimento</h1>
          <p className="text-foreground/60">
            Acesse normas, legislação e boas práticas de acessibilidade
          </p>
        </div>
      </header>

      {/* Search */}
      <div className="bg-white border-b border-primary/20 p-6">
        <div className="container mx-auto">
          <div className="flex gap-3">
            <Search className="w-5 h-5 text-foreground/40 flex-shrink-0 mt-1" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar artigos, normas, guias..."
              className="flex-1 px-4 py-2 bg-background border border-primary/20 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white/50 border-b border-primary/10 p-6">
        <div className="container mx-auto">
          <p className="text-foreground/60 text-sm mb-4">Filtrar por categoria:</p>
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={() => setSelectedCategory(null)}
              className={`${
                selectedCategory === null ? "btn-primary" : "btn-secondary"
              }`}
            >
              Todas
            </Button>
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 ${
                    selectedCategory === cat.id ? "btn-primary" : "btn-secondary"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Articles */}
      <div className="container mx-auto px-4 py-8">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
            <p className="text-foreground/60 text-lg">Nenhum artigo encontrado</p>
            <p className="text-foreground/40 mt-2">Tente ajustar seus filtros ou busca</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article: any) => (
              <div key={article.id} className="card-elegant group cursor-pointer hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-3">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    {article.category.replace(/_/g, " ")}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-foreground/60 text-sm line-clamp-3 mb-4">
                  {article.content}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground/40">
                    {new Date(article.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                  <Button className="btn-secondary text-xs">Ler Mais</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Section */}
      <section className="bg-white border-t border-primary/20 py-12 px-4 mt-12">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-foreground mb-6">Referências Normativas</h2>
          <div className="space-y-6">
            <div className="card-elegant">
              <h3 className="text-lg font-semibold text-foreground mb-2">ABNT NBR 9050</h3>
              <p className="text-foreground/60">
                Norma técnica que estabelece critérios e parâmetros técnicos para acessibilidade a edificações, mobiliário, espaços e equipamentos urbanos.
              </p>
            </div>
            <div className="card-elegant">
              <h3 className="text-lg font-semibold text-foreground mb-2">Lei Brasileira de Inclusão (Lei 13.146/2015)</h3>
              <p className="text-foreground/60">
                Institui a Lei Brasileira de Inclusão da Pessoa com Deficiência (Estatuto da Pessoa com Deficiência), garantindo direitos e liberdades fundamentais.
              </p>
            </div>
            <div className="card-elegant">
              <h3 className="text-lg font-semibold text-foreground mb-2">WCAG 2.1</h3>
              <p className="text-foreground/60">
                Web Content Accessibility Guidelines - diretrizes internacionais para acessibilidade de conteúdo web.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
