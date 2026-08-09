import type { ComponentType, SVGProps } from 'react'

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

export interface Translation {
  language_code: string
  title: string
  /** Absent on course and certification translations, which carry only a title. */
  description?: string
}

export interface Tag {
  id: number
  name: string
}

export interface Academy {
  id?: number
  name: string
}

export interface Category {
  id?: number
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

export interface Language {
  code: string
  name: string
}

/** Shared shape behind courses and certifications, which the API returns identically. */
export interface Credential {
  id: number
  year: number
  is_main: boolean
  url: string | null
  validation_serial?: string | null
  academy: Academy | null
  category: Category | null
  tags: Tag[]
  translations: Translation[]
}

export type Certification = Credential

export type Course = Credential

export interface Project {
  id: number
  year: number
  is_main: boolean
  image_url: string | null
  git_url: string | null
  deploy_url: string | null
  difficulty_level: DifficultyLevel | null
  project_type: ProjectType | null
  tags: Tag[]
  translations: Translation[]
}

/** One page of a list endpoint, with the unpaginated total from X-Total-Count. */
export interface Page<T> {
  items: T[]
  total: number
}
