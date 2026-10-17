import { ChevronRight } from "lucide-react";

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Você está em" className="text-sm text-mineral">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="text-navy">
                  {item.name}
                </span>
              ) : (
                <>
                  <a href={item.path} className="link-line hover:text-navy">
                    {item.name}
                  </a>
                  <ChevronRight className="h-3.5 w-3.5 text-gold-ink" aria-hidden="true" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
