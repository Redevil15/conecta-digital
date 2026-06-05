type Props = {
  completadas: number;
  total: number;
};

export default function ProgressBar({ completadas, total }: Props) {
  const pct = total > 0 ? Math.round((completadas / total) * 100) : 0;

  return (
    <div className="space-y-1">
      <div
        className="h-4 w-full overflow-hidden rounded-full bg-gray-200"
        role="progressbar"
        aria-valuenow={completadas}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`${completadas} de ${total} lecciones completadas`}
      >
        <div
          className="h-full rounded-full bg-green-600 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-sm font-medium text-gray-700">
        {completadas} de {total} lecciones
      </p>
    </div>
  );
}
