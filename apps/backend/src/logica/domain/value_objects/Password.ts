export class Password {
  private readonly value: string;

  constructor(value: string) {
    this.validate(value);
    this.value = value;
  }

  private validate(password: string): void {
    if (password.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      throw new Error('La contraseña debe contener al menos una mayúscula');
    }
    if (!/[a-z]/.test(password)) {
      throw new Error('La contraseña debe contener al menos una minúscula');
    }
    if (!/\d/.test(password)) {
      throw new Error('La contraseña debe contener al menos un dígito');
    }
  }

  getValue(): string {
    return this.value;
  }
}
