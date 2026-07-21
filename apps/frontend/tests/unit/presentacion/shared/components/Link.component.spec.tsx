import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LinkComponent } from '@shared/components/Link/Link.component';

describe('LinkComponent', () => {
  it('should render children and navigate to the given path', () => {
    render(
      <MemoryRouter>
        <LinkComponent to="/dashboard">Go to Dashboard</LinkComponent>
      </MemoryRouter>,
    );
    const link = screen.getByRole('link', { name: /go to dashboard/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/dashboard');
  });

  it('should apply navbar variant classes by default', () => {
    render(
      <MemoryRouter>
        <LinkComponent to="/">Home</LinkComponent>
      </MemoryRouter>,
    );
    const link = screen.getByRole('link');
    expect(link.className).toContain('text-gray-600');
  });

  it('should apply primary_button_indigo variant', () => {
    render(
      <MemoryRouter>
        <LinkComponent to="/login" variant="primary_button_indigo">
          Login
        </LinkComponent>
      </MemoryRouter>,
    );
    const link = screen.getByRole('link');
    expect(link.className).toContain('bg-indigo-600');
    expect(link.className).toContain('text-white');
  });

  it('should apply size classes', () => {
    render(
      <MemoryRouter>
        <LinkComponent to="/" size="lg">
          Large
        </LinkComponent>
      </MemoryRouter>,
    );
    const link = screen.getByRole('link');
    expect(link.className).toContain('px-6');
    expect(link.className).toContain('text-lg');
  });

  it('should merge custom className', () => {
    render(
      <MemoryRouter>
        <LinkComponent to="/" className="custom-class">
          Custom
        </LinkComponent>
      </MemoryRouter>,
    );
    const link = screen.getByRole('link');
    expect(link.className).toContain('custom-class');
    expect(link.className).toContain('text-gray-600');
  });

  it('should forward additional props like title', () => {
    render(
      <MemoryRouter>
        <LinkComponent to="/help" title="Help page">
          Help
        </LinkComponent>
      </MemoryRouter>,
    );
    expect(screen.getByRole('link')).toHaveAttribute('title', 'Help page');
  });
});
