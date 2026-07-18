import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ButtonComponent } from '@shared/components/Button/Button.component';

describe('ButtonComponent', () => {
  it('should render children text', () => {
    render(<ButtonComponent>Click me</ButtonComponent>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('should have type="button" by default', () => {
    render(<ButtonComponent>Test</ButtonComponent>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('should apply primary variant classes by default', () => {
    render(<ButtonComponent>Primary</ButtonComponent>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-indigo-600');
    expect(button.className).toContain('text-white');
  });

  it('should apply danger variant classes', () => {
    render(<ButtonComponent variant="danger">Delete</ButtonComponent>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('text-red-500');
  });

  it('should apply size classes', () => {
    render(<ButtonComponent size="lg">Large</ButtonComponent>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('px-6');
    expect(button.className).toContain('text-lg');
  });

  it('should merge custom className', () => {
    render(<ButtonComponent className="my-custom-class">Custom</ButtonComponent>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('my-custom-class');
    expect(button.className).toContain('bg-indigo-600');
  });

  it('should be disabled when disabled prop is passed', () => {
    render(<ButtonComponent disabled>Disabled</ButtonComponent>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<ButtonComponent onClick={handleClick}>Click</ButtonComponent>);
    screen.getByRole('button').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
