import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import * as ai from "./ai";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  demands: router({
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        description: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const classification = await ai.classifyDemand(input.title, input.description);
        await db.createDemand({
          userId: ctx.user.id,
          title: input.title,
          description: input.description,
          type: classification.type as any,
          category: classification.category as any,
          status: "triada",
          priority: classification.priority as any,
          assignedArea: classification.suggestedArea,
        });
        return { success: true, classification } as const;
      }),

    list: protectedProcedure
      .input(z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
      }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role === "colaborador") {
          return db.getDemandsByUserId(ctx.user.id, input.limit, input.offset);
        } else if (ctx.user.role === "gestor" && ctx.user.department) {
          return db.getDemandsByArea(ctx.user.department, input.limit, input.offset);
        } else {
          return [];
        }
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const demand = await db.getDemandById(input.id);
        if (!demand) return null;
        if (ctx.user.role === "colaborador" && demand.userId !== ctx.user.id) {
          return null;
        }
        if (ctx.user.role === "gestor" && demand.assignedArea !== ctx.user.department) {
          return null;
        }
        return demand;
      }),

    updateStatus: protectedProcedure
      .input(z.object({
        demandId: z.number(),
        newStatus: z.enum(["triada", "encaminhada", "em_progresso", "resolvida", "fechada"]),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role === "colaborador") {
          throw new Error("Sem permissão para atualizar status");
        }
        const demand = await db.getDemandById(input.demandId);
        if (!demand) throw new Error("Demanda não encontrada");
        if (ctx.user.role === "gestor" && demand.assignedArea !== ctx.user.department) {
          throw new Error("Sem permissão para atualizar esta demanda");
        }
        await db.updateDemandStatus(input.demandId, input.newStatus, input.notes);
        await db.addDemandHistory({
          demandId: input.demandId,
          previousStatus: demand.status,
          newStatus: input.newStatus as any,
          changedBy: ctx.user.id,
          notes: input.notes,
        });
        if (demand.userId !== ctx.user.id) {
          await db.createNotification({
            userId: demand.userId,
            demandId: input.demandId,
            type: "status_changed",
            message: `Sua demanda foi atualizada para: ${input.newStatus}`,
          });
        }
        return { success: true } as const;
      }),

    getHistory: protectedProcedure
      .input(z.object({ demandId: z.number() }))
      .query(async ({ ctx, input }) => {
        return db.getDemandHistory(input.demandId);
      }),

    getMetrics: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Sem permissão");
      }
      return {
        total: 0,
        aberta: 0,
        triada: 0,
        encaminhada: 0,
        em_progresso: 0,
        resolvida: 0,
        fechada: 0,
      };
    }),
  }),

  ai: router({
    classifyDemand: publicProcedure
      .input(z.object({
        title: z.string(),
        description: z.string(),
      }))
      .mutation(async ({ input }) => {
        return ai.classifyDemand(input.title, input.description);
      }),

    recommendSolution: publicProcedure
      .input(z.object({
        demandType: z.string(),
        demandCategory: z.string(),
        description: z.string(),
      }))
      .query(async ({ input }) => {
        const recommendations = await ai.generateRecommendations(
          input.demandType,
          input.demandCategory,
          input.description
        );
        return recommendations;
      }),

    chat: publicProcedure
      .input(z.object({
        message: z.string(),
      }))
      .mutation(async ({ input }) => {
        const response = await ai.chatbotResponse(input.message);
        return { response };
      }),
  }),

  ergonomic: router({
    createAssessment: protectedProcedure
      .input(z.object({
        responses: z.record(z.string(), z.any()),
        demandId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const recommendations = await ai.generateErgonomicRecommendations(input.responses);
        await db.createErgonomicAssessment({
          userId: ctx.user.id,
          demandId: input.demandId,
          responses: input.responses,
          recommendations: { text: recommendations },
          aiGeneratedAt: new Date(),
        });
        return { success: true, recommendations } as const;
      }),

    getRecommendations: protectedProcedure.query(async ({ ctx }) => {
      const assessments = await db.getErgonomicAssessmentsByUser(ctx.user.id);
      return assessments.map(a => a.recommendations);
    }),
  }),

  knowledge: router({
    list: publicProcedure
      .input(z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
      }))
      .query(async ({ ctx, input }) => {
        return db.getKnowledgeBase(input.limit, input.offset);
      }),

    search: publicProcedure
      .input(z.object({ term: z.string() }))
      .query(async ({ ctx, input }) => {
        return db.searchKnowledgeBase(input.term);
      }),

    getByCategory: publicProcedure
      .input(z.object({
        category: z.enum(["norma_abnt", "lei_brasileira_inclusao", "boa_prática", "guia"]),
      }))
      .query(async ({ ctx, input }) => {
        return db.getKnowledgeBaseByCategory(input.category);
      }),
  }),

  documents: router({
    uploadDocument: protectedProcedure
      .input(z.object({
        fileName: z.string(),
        fileKey: z.string(),
        fileUrl: z.string(),
        documentType: z.enum(["laudo_médico", "relatório_ergonômico", "foto_posto", "outro"]),
        demandId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.uploadDocument({
          userId: ctx.user.id,
          fileName: input.fileName,
          fileKey: input.fileKey,
          fileUrl: input.fileUrl,
          documentType: input.documentType,
          demandId: input.demandId,
          accessibleTo: (ctx.user.role === "admin" ? "admin" : "gestor") as any,
        });
        return { success: true } as const;
      }),

    getByDemand: protectedProcedure
      .input(z.object({ demandId: z.number() }))
      .query(async ({ ctx, input }) => {
        return db.getDocumentsByDemand(input.demandId);
      }),
  }),

  notifications: router({
    list: protectedProcedure
      .input(z.object({ limit: z.number().default(50) }))
      .query(async ({ ctx, input }) => {
        return db.getUserNotifications(ctx.user.id, input.limit);
      }),

    markAsRead: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return { success: true } as const;
      }),
  }),

  reports: router({
    getDemandMetrics: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role === "colaborador") {
        throw new Error("Sem permissão");
      }
      return {
        total: 0,
        aberta: 0,
        triada: 0,
        encaminhada: 0,
        em_progresso: 0,
        resolvida: 0,
        fechada: 0,
        tempoMedioResolucao: 0,
      };
    }),

    exportData: protectedProcedure
      .input(z.object({
        format: z.enum(["csv", "excel"]),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role === "colaborador") {
          throw new Error("Sem permissão");
        }
        return { success: true, format: input.format } as const;
      }),
  }),
});

export type AppRouter = typeof appRouter;
