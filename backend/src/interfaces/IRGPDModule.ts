export interface IRGPDModule {
  id: string;
  name: string;
  content: string;
  type: "popup" | "text_block";
  requiresAcceptance: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateRGPDModuleDTO = Omit<
  IRGPDModule,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateRGPDModuleDTO = Partial<CreateRGPDModuleDTO>;
