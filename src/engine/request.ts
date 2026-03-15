import {z} from "zod";

export type CanvasFormat = "square" | "portrait" | "landscape";

export type PromptRequest = {
  prompt: string;
  templateId?: string;
  canvasFormat?: CanvasFormat;
};

export const promptRequestSchema = z.object({
  prompt: z.string().min(1),
  templateId: z.string().optional(),
  canvasFormat: z.enum(["square", "portrait", "landscape"]).optional(),
});

export const promptCompositionPropsSchema = z.object({
  request: promptRequestSchema,
});
