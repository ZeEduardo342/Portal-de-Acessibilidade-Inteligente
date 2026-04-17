import { useAuth } from "@/_core/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, AlertCircle, CheckCircle, Clock, Users } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: metrics = {} as any } = trpc.reports.getDemandMetrics.useQuery();

  if (user?.role === "colaborador") {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-white border-b border-primary/20 shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-foreground">Acesso Restrito</h1>
            <p className="text-foreground/60">Dashboard disponível apenas para gestores e administradores</p>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <div className="card-elegant text-center">
            <AlertCircle className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
            <p className="text-foreground/60">Você não tem permissão para acessar este dashboard</p>
          </div>
        </div>
      </div>
    );
  }

  const demandsByStatus = [
    { name: "Aberta", value: metrics.aberta || 0, fill: "#D4AF37" },
    { name: "Triada", value: metrics.triada || 0, fill: "#1A3A52" },
    { name: "Em Progresso", value: metrics.em_progresso || 0, fill: "#F5E6D3" },
    { name: "Resolvida", value: metrics.resolvida || 0, fill: "#2ECC71" },
  ];

  const demandsByArea = [
    { name: "RH", demandas: 12 },
    { name: "Saúde", demandas: 8 },
    { name: "TI", demandas: 15 },
    { name: "Ergonomia", demandas: 10 },
    { name: "Facilities", demandas: 7 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-primary/20 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">Dashboard de Gestão</h1>
          <p className="text-foreground/60">Visão consolidada de demandas e métricas de acessibilidade</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card-elegant">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/60 text-sm">Total de Demandas</p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {metrics.total || 0}
                </p>
              </div>
              <AlertCircle className="w-10 h-10 text-primary/30" />
            </div>
          </div>

          <div className="card-elegant">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/60 text-sm">Demandas Abertas</p>
                <p className="text-3xl font-bold text-foreground mt-2">{metrics.aberta || 0}</p>
              </div>
              <Clock className="w-10 h-10 text-primary/30" />
            </div>
          </div>

          <div className="card-elegant">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/60 text-sm">Resolvidas</p>
                <p className="text-3xl font-bold text-foreground mt-2">{metrics.resolvida || 0}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-primary/30" />
            </div>
          </div>

          <div className="card-elegant">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/60 text-sm">Taxa de Resolução</p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {metrics.taxaResolucao ? `${Math.round(metrics.taxaResolucao)}%` : "0%"}
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-primary/30" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Demandas por Status */}
          <div className="card-elegant">
            <h3 className="text-lg font-semibold text-foreground mb-6">Demandas por Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={demandsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {demandsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Demandas por Área */}
          <div className="card-elegant">
            <h3 className="text-lg font-semibold text-foreground mb-6">Demandas por Área</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={demandsByArea}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip />
                <Bar dataKey="demandas" fill="#D4AF37" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="card-elegant">
          <h3 className="text-lg font-semibold text-foreground mb-6">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="btn-primary">Gerar Relatório</Button>
            <Button className="btn-secondary">Exportar Dados</Button>
            <Button className="btn-secondary">Configurações</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
