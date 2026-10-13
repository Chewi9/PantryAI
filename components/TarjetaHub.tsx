import Link from "next/link";
import type {ReactNode} from "react";

interface Props {
  href: string;
  icono: ReactNode;
  titulo: string;
  colorConfig: {
    borderHover: string;
    shadowHover: string;
    bgHover: string;
  };
}

export default function TarjetaHub({ href, icono, titulo, colorConfig }: Props) {
  return (
    <Link 
      href={href} 
      className={`group relative overflow-hidden rounded-3xl bg-gray-800 border border-gray-700 transition-all hover:-translate-y-2 ${colorConfig.borderHover} ${colorConfig.shadowHover}`}
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${colorConfig.bgHover}`} />
      <div className="p-10 md:p-12 flex flex-col items-center text-center h-full relative z-10">
        <span className="text-8xl mb-6 group-hover:scale-110 transition-transform duration-300 drop-shadow-md">
          {icono}
        </span>
        <h2 className="text-3xl font-bold text-white mb-3">{titulo}</h2>
      </div>
    </Link>
  );
}