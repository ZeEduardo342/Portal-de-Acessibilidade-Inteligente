import { invokeLLM } from "./_core/llm";

/**
 * Classifica uma demanda automaticamente usando IA
 * Retorna tipo, categoria, prioridade e área sugerida
 */
export async function classifyDemand(title: string, description: string) {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `Você é um assistente especializado em acessibilidade e ergonomia no ambiente corporativo.
Sua tarefa é classificar demandas de acessibilidade em uma organização.

Classifique a demanda nos seguintes campos:
- type: "física" (barreiras físicas/arquitetônicas), "digital" (tecnologia/software), "comunicação" (informação/linguagem), "ergonomia" (postura/ambiente), "outro"
- category: "arquitetônica" (estrutura do prédio), "tecnológica" (sistemas/software), "atitudinal" (preconceito/capacitismo), "comunicacional" (informação/linguagem), "outro"
- priority: "baixa", "média", "alta", "crítica"
- suggestedArea: "RH", "Saúde", "TI", "Ergonomia", "Facilities"

Responda APENAS em JSON válido, sem explicações adicionais.`,
        },
        {
          role: "user",
          content: `Classifique esta demanda:
Título: ${title}
Descrição: ${description}

Responda em JSON com os campos: type, category, priority, suggestedArea`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "demand_classification",
          strict: true,
          schema: {
            type: "object",
            properties: {
              type: {
                type: "string",
                enum: ["física", "digital", "comunicação", "ergonomia", "outro"],
              },
              category: {
                type: "string",
                enum: ["arquitetônica", "tecnológica", "atitudinal", "comunicacional", "outro"],
              },
              priority: {
                type: "string",
                enum: ["baixa", "média", "alta", "crítica"],
              },
              suggestedArea: {
                type: "string",
                enum: ["RH", "Saúde", "TI", "Ergonomia", "Facilities"],
              },
            },
            required: ["type", "category", "priority", "suggestedArea"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message.content;
    if (!content) throw new Error("No response from LLM");

    const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
    const parsed = JSON.parse(contentStr);
    return {
      type: parsed.type,
      category: parsed.category,
      priority: parsed.priority,
      suggestedArea: parsed.suggestedArea,
    };
  } catch (error) {
    console.error("[AI] Failed to classify demand:", error);
    // Fallback para classificação padrão
    return {
      type: "outro",
      category: "outro",
      priority: "média",
      suggestedArea: "RH",
    };
  }
}

/**
 * Gera recomendações para uma demanda baseado em histórico
 */
export async function generateRecommendations(
  demandType: string,
  demandCategory: string,
  description: string
) {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `Você é um especialista em acessibilidade e inclusão no ambiente corporativo.
Sua tarefa é gerar recomendações práticas e baseadas em normas (ABNT, Lei Brasileira de Inclusão) para resolver demandas de acessibilidade.

Forneça recomendações concretas, acionáveis e alinhadas com as melhores práticas.
Mencione normas e legislação relevantes quando aplicável.`,
        },
        {
          role: "user",
          content: `Gere recomendações para esta demanda de acessibilidade:
Tipo: ${demandType}
Categoria: ${demandCategory}
Descrição: ${description}

Forneça 3-5 recomendações práticas e concretas.`,
        },
      ],
    });

    const content = response.choices[0]?.message.content;
    const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
    return contentStr || "Recomendações não disponíveis no momento.";
  } catch (error) {
    console.error("[AI] Failed to generate recommendations:", error);
    return "Recomendações não disponíveis no momento.";
  }
}

/**
 * Gera recomendações ergonômicas baseado em respostas de avaliação
 */
export async function generateErgonomicRecommendations(responses: Record<string, any>) {
  try {
    const responsesText = Object.entries(responses)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `Você é um especialista em ergonomia e saúde ocupacional.
Sua tarefa é analisar respostas de uma avaliação ergonômica e gerar recomendações personalizadas.

Baseie suas recomendações em:
- Normas técnicas (ABNT NBR 5413, NBR 9050, etc.)
- Princípios de ergonomia
- Lei Brasileira de Inclusão
- Boas práticas de acessibilidade

Forneça recomendações práticas, priorizadas por urgência.`,
        },
        {
          role: "user",
          content: `Analise esta avaliação ergonômica e gere recomendações:

${responsesText}

Forneça recomendações em ordem de prioridade (crítica, alta, média, baixa).`,
        },
      ],
    });

    const content = response.choices[0]?.message.content;
    const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
    return contentStr || "Recomendações não disponíveis.";
  } catch (error) {
    console.error("[AI] Failed to generate ergonomic recommendations:", error);
    return "Recomendações não disponíveis.";
  }
}

/**
 * Triagem e orientação via chatbot
 */
export async function chatbotResponse(userMessage: string, context?: string) {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `Você é um assistente de acessibilidade e inclusão em uma organização corporativa.
Sua tarefa é:
1. Entender demandas de acessibilidade dos colaboradores
2. Oferecer orientações e informações sobre direitos e recursos
3. Encaminhar para a área apropriada quando necessário
4. Ser empático e respeitoso, evitando linguagem capacitista

Sempre mencione normas relevantes (ABNT, Lei Brasileira de Inclusão) quando apropriado.
Seja conciso mas informativo.`,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const content = response.choices[0]?.message.content;
    const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
    return contentStr || "Desculpe, não consegui processar sua mensagem.";
  } catch (error) {
    console.error("[AI] Chatbot error:", error);
    return "Desculpe, estou temporariamente indisponível. Por favor, tente novamente.";
  }
}
