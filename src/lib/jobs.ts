export type JobType = "emprego" | "estagio" | "jovem-aprendiz" | "freelancer";

export interface Job {
  id: string;
  company: string;
  companyInitials: string;
  companyGradient: [string, string];
  title: string;
  type: JobType;
  typeLabel: string;
  salary: string;
  location: string;
  postedAt: string; // "Há 2 dias", etc.
  description?: string;
  urgent?: boolean;
}

export const JOB_FILTERS: { value: JobType | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "emprego", label: "Emprego" },
  { value: "estagio", label: "Estágio" },
  { value: "jovem-aprendiz", label: "Jovem Aprendiz" },
  { value: "freelancer", label: "Freelancer" },
];

export const sampleJobs: Job[] = [];

export function getTypeBadgeColor(type: JobType): string {
  switch (type) {
    case "emprego":
      return "bg-primary/12 text-primary";
    case "estagio":
      return "bg-primary-vibrant/12 text-primary-vibrant";
    case "jovem-aprendiz":
      return "bg-gold/15 text-gold-foreground";
    case "freelancer":
      return "bg-accent text-accent-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
}
