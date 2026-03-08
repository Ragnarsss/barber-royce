/**
 * Tipos para About (Página de Nosotros)
 * Single source of truth para estructura de about
 */

import type { LucideIcon } from "lucide-react";

export interface Value {
    title: string;
    description: string;
    icon: LucideIcon;
}

export interface WhyUsItem {
    number: string;
    title: string;
    description: string;
}

export interface MissionVision {
    title: string;
    description: string;
}

export interface AboutStory {
    paragraphs: readonly string[];
}
