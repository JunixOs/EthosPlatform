import { describe, it, expect } from 'vitest';
import { Email } from '@/logica/domain/value_objects/Email';

describe('Email Value Object', () => {
  it.each([
    ['a valid address', 'user@example.com'],
    ['uppercase, normalized to lowercase', 'USER@EXAMPLE.COM'],
    ['surrounding whitespace, trimmed', '  user@example.com  '],
  ])('should create an Email with %s', (_case, value) => {
    const email = new Email(value);
    expect(email.getValue()).toBe('user@example.com');
  });

  it.each([
    ['missing @ symbol', 'userexample.com'],
    ['missing domain', 'user@'],
    ['missing local part', '@example.com'],
    ['missing TLD', 'user@example'],
    ['spaces in address', 'user name@example.com'],
  ])('should throw for %s', (_case, value) => {
    expect(() => new Email(value)).toThrow('Email inválido');
  });

  it('should consider two emails with same value as equal', () => {
    const a = new Email('a@example.com');
    const b = new Email('A@EXAMPLE.COM');
    expect(a.equals(b)).toBe(true);
  });

  it('should consider two different emails as not equal', () => {
    const a = new Email('a@example.com');
    const b = new Email('b@example.com');
    expect(a.equals(b)).toBe(false);
  });
});
