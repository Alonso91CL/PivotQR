export interface Enlace {
  id: string;
  proyecto_id: string;
  slug: string;
  url_destino: string;
  pausado: boolean;
  color_fondo: string | null;
  color_patron: string | null;
  estilo: string | null;
  logo_url: string | null;
  creado_en: string;
}

export interface Proyecto {
  id: string;
  owner_id: string;
  nombre: string;
  descripcion: string;
  reporte_publico: boolean;
  codigo_acceso: string | null;
  creado_en: string;
}