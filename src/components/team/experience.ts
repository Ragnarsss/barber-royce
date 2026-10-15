/** Experiencia como dato grande en la ficha (BR-063): `15 años de experiencia` → `15` + `años de experiencia`. */
export function experienceHighlight(experience: string): { value: string; label: string } | null {
  const match = experience.trim().match(/^(\+?\d+)\s+(.+)$/);
  return match ? { value: match[1], label: match[2] } : null;
}
