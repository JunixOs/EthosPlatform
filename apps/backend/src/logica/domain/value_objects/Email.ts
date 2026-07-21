export class Email {
  private readonly value: string;

  constructor(value: string) {
    const trimmed = value.trim();
    this.validate(trimmed);
    this.value = trimmed.toLowerCase();
  }

  private validate(email: string): void {
    // Los segmentos entre puntos excluyen el punto explícitamente (`[^\s@.]+`)
    // para que no se solapen con el separador literal `\.` y evitar el
    // backtracking exponencial que tenía `[^\s@]+\.[^\s@]+`.
    const emailRegex = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Email inválido');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
