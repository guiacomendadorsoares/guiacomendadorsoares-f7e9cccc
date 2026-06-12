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

export const sampleJobs: Job[] = [
  {
    id: "1",
    company: "Padaria Pão de Ouro",
    companyInitials: "PO",
    companyGradient: ["#D4A843", "#F0C75E"],
    title: "Atendente de Loja",
    type: "emprego",
    typeLabel: "CLT",
    salary: "R$ 1.800 – R$ 2.200",
    location: "Comendador Soares, Nova Iguaçu",
    postedAt: "Há 2 dias",
    urgent: true,
    description:
      "Responsável pelo atendimento ao cliente, organização do salão e auxílio no caixa. Experiência com atendimento desejada.",
  },
  {
    id: "2",
    company: "Auto Center Soares",
    companyInitials: "AS",
    companyGradient: ["#2B5A3E", "#4CAF50"],
    title: "Mecânico de Automóveis",
    type: "emprego",
    typeLabel: "CLT",
    salary: "R$ 2.500 – R$ 3.500",
    location: "Comendador Soares, Nova Iguaçu",
    postedAt: "Há 4 dias",
    description:
      "Realizar manutenção preventiva e corretiva em veículos leves. Experiência mínima de 2 anos comprovada.",
  },
  {
    id: "3",
    company: "Academia FitZone",
    companyInitials: "FZ",
    companyGradient: ["#0D7377", "#14FFEC"],
    title: "Recepcionista",
    type: "estagio",
    typeLabel: "Estágio",
    salary: "Bolsa R$ 1.200 + VT + VR",
    location: "Comendador Soares, Nova Iguaçu",
    postedAt: "Há 1 dia",
    urgent: true,
    description:
      "Atendimento telefônico e presencial, agendamento de aulas e controle de acesso. Curso superior em andamento.",
  },
  {
    id: "4",
    company: "Ótica Visão Clara",
    companyInitials: "VC",
    companyGradient: ["#4A6FA5", "#7BA3D8"],
    title: "Vendedor(a) Jovem Aprendiz",
    type: "jovem-aprendiz",
    typeLabel: "Jovem Aprendiz",
    salary: "R$ 1.100 + benefícios",
    location: "Comendador Soares, Nova Iguaçu",
    postedAt: "Há 3 dias",
    description:
      "Auxiliar no atendimento ao cliente e organização da loja. Idade entre 14 e 22 anos. Disponibilidade para jornada de 6h.",
  },
  {
    id: "5",
    company: "Agência Digital Local",
    companyInitials: "DL",
    companyGradient: ["#6B3FA0", "#A855F7"],
    title: "Designer Gráfico",
    type: "freelancer",
    typeLabel: "Freelancer",
    salary: "R$ 80 – R$ 150 /hora",
    location: "Remoto / Comendador Soares",
    postedAt: "Há 5 horas",
    description:
      "Criação de artes para redes sociais, identidade visual e material gráfico. Portfólio obrigatório.",
  },
  {
    id: "6",
    company: "Clínica Viver Bem",
    companyInitials: "VB",
    companyGradient: ["#C0392B", "#E74C3C"],
    title: "Técnico de Enfermagem",
    type: "emprego",
    typeLabel: "CLT",
    salary: "R$ 2.200 – R$ 2.800",
    location: "Comendador Soares, Nova Iguaçu",
    postedAt: "Há 1 semana",
    description:
      "Assistência direta aos pacientes, aplicação de medicamentos e curativos. Registro COREN ativo obrigatório.",
  },
];

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
