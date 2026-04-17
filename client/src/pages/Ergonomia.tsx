import { useState } from "react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Brain, CheckCircle, AlertCircle } from "lucide-react";

interface FormResponse {
  [key: string]: string | number;
}

export default function Ergonomia() {
  const [showForm, setShowForm] = useState(false);
  const [responses, setResponses] = useState<FormResponse>({});
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; recommendations?: string } | null>(null);

  const createAssessment = trpc.ergonomic.createAssessment.useMutation({
    onSuccess: (data) => {
      toast.success("Avaliação criada com sucesso!");
      setResult({
        success: true,
        recommendations: data.recommendations,
      });
      setResponses({});
    },
    onError: (error) => {
      toast.error("Erro ao criar avaliação: " + error.message);
    },
  });

  const questions = [
    {
      id: "postura",
      label: "Como você avalia sua postura durante o trabalho?",
      options: ["Excelente", "Boa", "Adequada", "Precisa melhorar", "Ruim"],
    },
    {
      id: "iluminacao",
      label: "A iluminação do seu ambiente de trabalho é adequada?",
      options: ["Sim, excelente", "Sim, boa", "Adequada", "Não, inadequada", "Muito inadequada"],
    },
    {
      id: "ruido",
      label: "Qual é o nível de ruído no seu ambiente?",
      options: ["Silencioso", "Baixo", "Moderado", "Alto", "Muito alto"],
    },
    {
      id: "equipamentos",
      label: "Seus equipamentos (cadeira, mesa, monitor) são ergonômicos?",
      options: ["Sim, muito", "Sim, adequados", "Parcialmente", "Não muito", "Não"],
    },
    {
      id: "pausas",
      label: "Com que frequência você faz pausas durante o trabalho?",
      options: ["A cada 30 min", "A cada 1h", "A cada 2h", "Raramente", "Nunca"],
    },
    {
      id: "dor",
      label: "Você sente dor ou desconforto durante o trabalho?",
      options: ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"],
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createAssessment.mutateAsync({
        responses,
        demandId: undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (result?.success) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-white border-b border-primary/20 shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-foreground">Avaliação Ergonômica</h1>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="card-elegant border-2 border-primary/30">
            <div className="flex items-start gap-4 mb-6">
              <CheckCircle className="w-12 h-12 text-primary flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-foreground">Avaliação Concluída!</h2>
                <p className="text-foreground/60 mt-1">Suas recomendações foram geradas com sucesso</p>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-foreground mb-4">Recomendações Personalizadas:</h3>
              <div className="prose prose-sm max-w-none text-foreground/80">
                {result.recommendations}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setResult(null);
                  setShowForm(false);
                }}
                className="btn-primary"
              >
                Nova Avaliação
              </Button>
              <Button className="btn-secondary">Salvar Recomendações</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-primary/20 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Avaliação Ergonômica</h1>
              <p className="text-foreground/60">Receba recomendações personalizadas baseadas em IA</p>
            </div>
          </div>
        </div>
      </header>

      {!showForm ? (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
          <div className="card-elegant text-center">
            <Brain className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Avalie seu Ambiente de Trabalho
            </h2>
            <p className="text-foreground/60 mb-8">
              Responda um breve questionário sobre sua postura, iluminação, equipamentos e bem-estar.
              Nossas recomendações personalizadas ajudarão a melhorar sua ergonomia.
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="btn-primary text-lg px-8 py-3"
            >
              Iniciar Avaliação
            </Button>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {questions.map((question) => (
              <div key={question.id} className="card-elegant">
                <label className="block font-semibold text-foreground mb-4">
                  {question.label}
                </label>
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <label key={option} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        checked={responses[question.id] === option}
                        onChange={(e) =>
                          setResponses({
                            ...responses,
                            [question.id]: e.target.value,
                          })
                        }
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-foreground/70">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isLoading || Object.keys(responses).length < questions.length}
                className="btn-primary flex-1"
              >
                {isLoading ? "Processando..." : "Obter Recomendações"}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setResponses({});
                }}
                className="btn-secondary"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
