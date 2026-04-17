import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Search, Filter, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function Demandas() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [isLoading, setIsLoading] = useState(false);

  const { data: demands = [], refetch } = trpc.demands.list.useQuery({
    limit: 50,
    offset: 0,
  });

  const createDemand = trpc.demands.create.useMutation({
    onSuccess: () => {
      toast.success("Demanda criada com sucesso!");
      setFormData({ title: "", description: "" });
      setShowForm(false);
      refetch();
    },
    onError: (error) => {
      toast.error("Erro ao criar demanda: " + error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createDemand.mutateAsync({
        title: formData.title,
        description: formData.description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badgeClass = `badge-status badge-${status}`;
    const statusLabels: Record<string, string> = {
      aberta: "Aberta",
      triada: "Triada",
      encaminhada: "Encaminhada",
      em_progresso: "Em Progresso",
      resolvida: "Resolvida",
      fechada: "Fechada",
    };
    return (
      <span className={badgeClass}>
        {statusLabels[status] || status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-primary/20 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Minhas Demandas</h1>
              <p className="text-foreground/60 mt-1">Acompanhe suas solicitações de acessibilidade</p>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nova Demanda
            </Button>
          </div>
        </div>
      </header>

      {/* Formulário */}
      {showForm && (
        <div className="bg-white border-b border-primary/20 p-6">
          <div className="container mx-auto max-w-2xl">
            <h3 className="text-2xl font-semibold text-foreground mb-6">Criar Nova Demanda</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-foreground font-medium mb-2">Título</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Necessidade de acessibilidade visual"
                  className="input-elegant"
                  required
                />
              </div>
              <div>
                <label className="block text-foreground font-medium mb-2">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva sua demanda em detalhes..."
                  className="textarea-elegant"
                  rows={5}
                  required
                />
              </div>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary"
                >
                  {isLoading ? "Criando..." : "Criar Demanda"}
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white/50 border-b border-primary/10 p-4">
        <div className="container mx-auto flex gap-4 items-center">
          <Search className="w-5 h-5 text-foreground/40" />
          <input
            type="text"
            placeholder="Buscar demandas..."
            className="flex-1 px-3 py-2 bg-white border border-primary/20 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary"
          />
          <Button className="btn-secondary flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtrar
          </Button>
        </div>
      </div>

      {/* Lista de Demandas */}
      <div className="container mx-auto px-4 py-8">
        {demands.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
            <p className="text-foreground/60 text-lg">Nenhuma demanda encontrada</p>
            <p className="text-foreground/40 mt-2">Crie sua primeira demanda para começar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {demands.map((demand: any) => (
              <div key={demand.id} className="card-elegant">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-foreground">{demand.title}</h4>
                    <p className="text-foreground/60 mt-1 line-clamp-2">{demand.description}</p>
                  </div>
                  {getStatusBadge(demand.status)}
                </div>
                <div className="flex gap-6 text-sm text-foreground/60 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Criada em {new Date(demand.createdAt).toLocaleDateString("pt-BR")}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                      {demand.priority}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="btn-secondary text-sm">Ver Detalhes</Button>
                  {demand.status === "aberta" && (
                    <Button className="btn-secondary text-sm">Editar</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
