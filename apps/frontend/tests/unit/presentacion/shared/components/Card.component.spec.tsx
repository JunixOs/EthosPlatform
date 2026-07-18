import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CardComponent } from '@shared/components/Card/Card.component';

describe('CardComponent', () => {
  it('should render children', () => {
    render(
      <CardComponent>
        <p>Card content</p>
      </CardComponent>,
    );
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('should render as a div by default', () => {
    render(<CardComponent>Test</CardComponent>);
    expect(screen.getByText('Test').tagName).toBe('DIV');
  });

  it('should apply rounded-xl class', () => {
    render(<CardComponent>Rounded</CardComponent>);
    const card = screen.getByText('Rounded');
    expect(card.className).toContain('rounded-xl');
  });

  it('should apply outlined variant classes', () => {
    render(<CardComponent variant="outlined">Outlined</CardComponent>);
    const card = screen.getByText('Outlined');
    expect(card.className).toContain('border');
    expect(card.className).toContain('bg-white');
  });

  it('should apply hover variant classes', () => {
    render(<CardComponent variant="hover">Hover</CardComponent>);
    const card = screen.getByText('Hover');
    expect(card.className).toContain('hover:shadow-md');
    expect(card.className).toContain('transition-all');
  });

  it('should merge custom className', () => {
    render(<CardComponent className="my-extra-class">Custom</CardComponent>);
    const card = screen.getByText('Custom');
    expect(card.className).toContain('my-extra-class');
    expect(card.className).toContain('rounded-xl');
  });

  it('should forward data-testid', () => {
    render(<CardComponent data-testid="test-card">Test</CardComponent>);
    expect(screen.getByTestId('test-card')).toBeInTheDocument();
  });
});
