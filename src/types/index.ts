import type { ComponentType, SVGProps } from 'react'

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

export interface Translation {
  language_code: string
  title: string
  description: string
}

export interface Tag {
  id: number
  name: string
}

export interface Academy {
  name: string
}

export interface DifficultyLevel {
  id?: number
  name: string
}

export interface ProjectType {
  id?: number
  name: string
}

export interface FilterOption {
  id: number
  name: string
}

/** Shared shape behind courses and certifications, which the API returns identically. */
export interface Credential {
  id: number
  year: number
  url: string
  academy: Academy
  tags: Tag[]
  translations: Translation[]
}

export type Certification = Credential

export type Course = Credential

export interface Project {
  id: number
  year: number
  image_url: string
  git_url: string
  deploy_url: string
  difficulty_level: DifficultyLevel
  project_type: ProjectType
  tags: Tag[]
  translations: Translation[]
}
