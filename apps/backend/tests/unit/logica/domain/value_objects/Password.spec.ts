import { describe, it, expect } from 'vitest';
import { Password } from '@/logica/domain/value_objects/Password';

describe('Password Value Object', () => {
  it('should create a Password with a valid value', () => {
    const password = new Password('StrongPass1');
    expect(password.getValue()).toBe('StrongPass1');
  });

  it('should throw for passwords shorter than 8 characters', () => {
    expect(() => new Password('Short1A')).toThrow(
      'La contraseña debe tener al menos 8 caracteres',
    );
  });

  it('should throw for passwords without uppercase', () => {
    expect(() => new Password('lowercase1')).toThrow(
      'La contraseña debe contener al menos una mayúscula',
    );
  });

  it('should throw for passwords without lowercase', () => {
    expect(() => new Password('UPPERCASE1')).toThrow(
      'La contraseña debe contener al menos una minúscula',
    );
  });

  it('should throw for passwords without digits', () => {
    expect(() => new Password('NoDigitsHere')).toThrow(
      'La contraseña debe contener al menos un dígito',
    );
  });

  it('should throw for empty string', () => {
    expect(() => new Password('')).toThrow(
      'La contraseña debe tener al menos 8 caracteres',
    );
  });

  it('should accept a password with exactly 8 characters meeting all rules', () => {
    const password = new Password('A1b2c3d4');
    expect(password.getValue()).toBe('A1b2c3d4');
  });

  it('should accept a complex password', () => {
    const password = new Password('MyP@ssw0rd!2024');
    expect(password.getValue()).toBe('MyP@ssw0rd!2024');
  });
});
