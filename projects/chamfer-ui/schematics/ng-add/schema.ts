export interface Schema {
  /** Projeto onde o Chamfer UI será configurado. */
  project?: string;
  /** Adiciona as fontes do Google Fonts ao index.html. */
  fonts: boolean;
  /** Aplica cf-screen (fundo com vinheta) no <body>. */
  background: boolean;
}
