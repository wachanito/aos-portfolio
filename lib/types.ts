export interface Numero {
  valor: string;
  label: string;
}

export interface Proyecto {
  id: number;
  slug: string;
  titulo: string;
  numero: string;
  rol: string;
  tags: string;
  reto: string;
  insight?: string;
  accion: string;
  resultado: string;
  tipoClimax: 'numerico' | 'frase';
  climaxFrase?: string;
  climaxNums?: Numero[];
  climaxSublabel?: string;
  mediaTipo: 'imagen' | 'video';
  mediaUrl?: string;
  vimeoId?: string;
  posterUrl?: string;
  boardUrl?: string;
  boardFit?: 'cover' | 'contain';
  galeria?: string[];
  galeria2?: string[];
  esPropuesta?: boolean;
  enDesarrollo?: boolean;
  password?: string;
}
