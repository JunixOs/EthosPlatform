import { describe, it, expect } from 'vitest';
import { Email } from '@/logica/domain/value_objects/Email';

describe('Email Value Object', () => {
  it('should create an Email with a valid address', () => {
    const email = new Email('user@example.com');
    expect(email.getValue()).toBe('user@example.com');
  });

  it('should normalize email to lowercase', () => {
    const email = new Email('USER@EXAMPLE.COM');
    expect(email.getValue()).toBe('user@example.com');
  });

  it('should trim whitespace', () => {
    const email = new Email('  user@example.com  ');
    expect(email.getValue()).toBe('user@example.com');
  });

  it('should throw for missing @ symbol', () => {
    expect(() => new Email('userexample.com')).toThrow('Email inválido');
  });

  it('should throw for missing domain', () => {
    expect(() => new Email('user@')).toThrow('Email inválido');
  });

  it('should throw for missing local part', () => {
    expect(() => new Email('@example.com')).toThrow('Email inválido');
  });

  it('should throw for missing TLD', () => {
    expect(() => new Email('user@example')).toThrow('Email inválido');
  });

  it('should throw for spaces in address', () => {
    expect(() => new Email('user name@example.com')).toThrow('Email inválido');
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
