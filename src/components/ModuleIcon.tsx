import {
  Mail,
  MessageCircle,
  FileText,
  Shield,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

type Config = { Icon: LucideIcon; badge: string };

// El nombre viene del campo `icono` de cada módulo en la base de datos.
const CONFIG: Record<string, Config> = {
  mail: { Icon: Mail, badge: "bg-blue-100 text-blue-700" },
  "message-circle": { Icon: MessageCircle, badge: "bg-green-100 text-green-700" },
  "file-text": { Icon: FileText, badge: "bg-amber-100 text-amber-700" },
  shield: { Icon: Shield, badge: "bg-violet-100 text-violet-700" },
};

const FALLBACK: Config = { Icon: BookOpen, badge: "bg-gray-100 text-gray-700" };

export default function ModuleIcon({
  name,
  size = "md",
}: {
  name: string;
  size?: "md" | "lg";
}) {
  const { Icon, badge } = CONFIG[name] ?? FALLBACK;
  const box = size === "lg" ? "h-16 w-16" : "h-14 w-14";
  const icon = size === "lg" ? "h-9 w-9" : "h-7 w-7";

  return (
    <span
      className={`flex ${box} shrink-0 items-center justify-center rounded-2xl ${badge}`}
      aria-hidden="true"
    >
      <Icon className={icon} strokeWidth={2} />
    </span>
  );
}
