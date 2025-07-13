export interface KnowledgeBox {
  id: string;
  title: string;
  topic: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  isPublic: boolean;
  tags: string[];
  collaborators?: string[];
}

export interface CreateKnowledgeBoxRequest {
  title: string;
  topic: string;
  content?: string;
  isPublic?: boolean;
  tags?: string[];
}

export interface UpdateKnowledgeBoxRequest {
  id: string;
  title?: string;
  topic?: string;
  content?: string;
  isPublic?: boolean;
  tags?: string[];
}

export interface KnowledgeBoxResponse {
  success: boolean;
  message?: string;
  knowledgeBox?: KnowledgeBox;
}

export interface KnowledgeBoxListResponse {
  success: boolean;
  message?: string;
  knowledgeBoxes?: KnowledgeBox[];
  totalCount?: number;
}

export interface DeleteKnowledgeBoxResponse {
  success: boolean;
  message?: string;
}