export enum UserType {
    ADMIN = 'ADMIN',
    CREATOR = 'CREATOR',
    READER = 'READER',
}

export enum ContentType {
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO',
    TEXT = 'TEXT',
}

export interface Category {
    id?: string;
    name: string;
    type: ContentType;
    coverImage?: string;
}

export interface Topic {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateTopicDto {
    name: string;
}

export interface AssignCategoriesDto {
    categoryIds: string[];
}

export interface Content {
    id: string;
    title: string;
    type: string;
    createdAt: Date;
    updatedAt: Date;
    credits: string;
    userId: string;
    categoryId: string;
    topicId: string;
  }