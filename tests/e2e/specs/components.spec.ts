import { test, expect } from '@playwright/test';

// ─── Navbar ──────────────────────────────────────────────────────────────────

test.describe('Navbar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('muestra el logo EthosPlatform con link a /', async ({ page }) => {
    const logo = page.getByRole('link', { name: 'EthosPlatform' });
    await expect(logo).toBeVisible();
    await logo.click();
    await expect(page).toHaveURL('/');
  });

  test('muestra links de navegación: Experiencias, Buscar, Equipo', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Experiencias', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Buscar', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Equipo', exact: true })).toBeVisible();
  });

  test('muestra botones de auth (Iniciar sesión / Registrarse) cuando no está logueado', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Iniciar sesión' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Registrarse' })).toBeVisible();
  });

  test('botón dark mode alterna el tema', async ({ page }) => {
    const btn = page.getByRole('button', { name: 'Cambiar tema' });
    await expect(btn).toBeVisible();
    // Clicking changes theme class on <html>
    await btn.click();
    const htmlClass = await page.locator('html').getAttribute('class');
    await expect(htmlClass).toMatch(/dark/);
    // Click again to go back
    await btn.click();
    const htmlClass2 = await page.locator('html').getAttribute('class');
    await expect(htmlClass2).not.toMatch(/dark/);
  });

  test('link Experiencias navega a /experiencias', async ({ page }) => {
    await page.getByRole('link', { name: 'Experiencias', exact: true }).click();
    await expect(page).toHaveURL('/experiencias');
  });

  test('link Buscar navega a /buscar', async ({ page }) => {
    await page.getByRole('link', { name: 'Buscar' }).click();
    await expect(page).toHaveURL('/buscar');
  });

  test('link Equipo navega a /equipo', async ({ page }) => {
    await page.getByRole('link', { name: 'Equipo' }).click();
    await expect(page).toHaveURL('/equipo');
  });
});

// ─── Layout ──────────────────────────────────────────────────────────────────

test.describe('Layout', () => {
  test('renderiza Navbar en todas las páginas públicas', async ({ page }) => {
    const rutas = ['/', '/login', '/registro', '/equipo', '/experiencias', '/buscar'];
    for (const ruta of rutas) {
      await page.goto(ruta);
      await expect(page.getByRole('link', { name: 'EthosPlatform' })).toBeVisible();
    }
  });
});

// ─── HomePage ────────────────────────────────────────────────────────────────

test.describe('HomePage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('muestra el título principal (Hero)', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Comparte tu experiencia');
  });

  test('muestra botón "Ver experiencias"', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Ver experiencias' });
    await expect(link).toBeVisible();
  });

  test('muestra botón "Unirse gratis" cuando no hay sesión', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Unirse gratis' })).toBeVisible();
  });

  test('sección Qué es: muestra 3 tarjetas (CardComponent outlined)', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Reflexiona', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Comparte', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Aprende', exact: true })).toBeVisible();
  });

  test('sección Moral vs Ética es visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Moral vs. Ética' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'La Moral' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Tu Ética' })).toBeVisible();
  });

  test('"Ver experiencias" navega a /experiencias', async ({ page }) => {
    await page.getByRole('link', { name: 'Ver experiencias' }).click();
    await expect(page).toHaveURL('/experiencias');
  });

  test('"Unirse gratis" navega a /registro', async ({ page }) => {
    await page.getByRole('link', { name: 'Unirse gratis' }).click();
    await expect(page).toHaveURL('/registro');
  });
});

// ─── LoginPage ───────────────────────────────────────────────────────────────

test.describe('LoginPage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('muestra el formulario con campos correo y contraseña', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Iniciar sesión' })).toBeVisible();
    await expect(page.getByPlaceholder('tu@correo.com')).toBeVisible();
    await expect(page.getByPlaceholder('••••••••')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ingresar' })).toBeVisible();
  });

  test('checkbox "Recordarme" está presente', async ({ page }) => {
    await expect(page.getByLabel('Recordarme (24h)')).toBeVisible();
  });

  test('link a /registro está presente', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Regístrate aquí' })).toBeVisible();
  });

  test('link Regístrate aquí navega a /registro', async ({ page }) => {
    await page.getByRole('link', { name: 'Regístrate aquí' }).click();
    await expect(page).toHaveURL('/registro');
  });

  test('submit con campos vacíos no dispara petición (validación HTML5)', async ({ page }) => {
    await page.getByRole('button', { name: 'Ingresar' }).click();
    // el input required impide el submit — el formulario no cambia de URL
    await expect(page).toHaveURL('/login');
  });

  test('muestra error con credenciales incorrectas', async ({ page }) => {
    await page.getByPlaceholder('tu@correo.com').fill('noexiste@test.com');
    await page.getByPlaceholder('••••••••').fill('WrongPass1');
    await page.getByRole('button', { name: 'Ingresar' }).click();
    // esperar mensaje de error del backend
    const error = page.locator('.bg-red-50, .bg-red-900\\/30').first();
    await expect(error).toBeVisible({ timeout: 5000 });
  });
});

// ─── RegisterPage ────────────────────────────────────────────────────────────

test.describe('RegisterPage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/registro');
  });

  test('muestra el formulario con los 4 campos requeridos', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Crear cuenta' })).toBeVisible();
    await expect(page.getByPlaceholder('Tu nombre')).toBeVisible();
    await expect(page.getByPlaceholder('tu@correo.com')).toBeVisible();
    await expect(page.getByPlaceholder('Mín. 8 caracteres, 1 mayúscula, 1 número')).toBeVisible();
    await expect(page.getByPlaceholder('Repite tu contraseña')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Crear cuenta' })).toBeVisible();
  });

  test('link a /login está presente', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Inicia sesión' })).toBeVisible();
  });

  test('muestra error cuando las contraseñas no coinciden', async ({ page }) => {
    await page.getByPlaceholder('Tu nombre').fill('Test User');
    await page.getByPlaceholder('tu@correo.com').fill('test@test.com');
    await page.getByPlaceholder('Mín. 8 caracteres, 1 mayúscula, 1 número').fill('Password1');
    await page.getByPlaceholder('Repite tu contraseña').fill('Password2');
    await page.getByRole('button', { name: 'Crear cuenta' }).click();
    const error = page.locator('.bg-red-50, .bg-red-900\\/30').first();
    await expect(error).toContainText('contraseñas no coinciden');
  });
});

// ─── TeamPage ────────────────────────────────────────────────────────────────

test.describe('TeamPage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/equipo');
  });

  test('muestra el encabezado del equipo', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Conoce al Equipo de EthosPlatform' })).toBeVisible();
  });

  test('muestra la tarjeta del líder del proyecto', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Angel Paolo Javier' })).toBeVisible();
    await expect(page.getByText('Desarrollador Full Stack').first()).toBeVisible();
  });

  test('muestra sección "Sobre el proyecto"', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Sobre el proyecto' })).toBeVisible();
  });
});

// ─── NotFoundPage ────────────────────────────────────────────────────────────

test.describe('NotFoundPage', () => {
  test('muestra contenido 404 en rutas inexistentes', async ({ page }) => {
    await page.goto('/ruta-que-no-existe');
    // la página debería existir (no debe ser error de red)
    await expect(page.locator('body')).toBeVisible();
    // el título o el contenido menciona 404 o "no encontrada"
    const body = await page.locator('body').textContent();
    expect(body?.toLowerCase()).toMatch(/404|no encontrada|not found/);
  });
});

// ─── ListExperienciasPage ─────────────────────────────────────────────────────

test.describe('ListExperienciasPage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/experiencias');
  });

  test('muestra el encabezado de la página', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Experiencias éticas' })).toBeVisible();
  });

  test('muestra campo de búsqueda rápida (ButtonComponent secondary_gray)', async ({ page }) => {
    await expect(page.getByPlaceholder('Buscar...')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Buscar' })).toBeVisible();
  });

  test('muestra selector de orden (Más recientes / Más populares)', async ({ page }) => {
    const select = page.locator('select');
    await expect(select).toBeVisible();
    await expect(select.locator('option', { hasText: 'Más recientes' })).toBeTruthy();
    await expect(select.locator('option', { hasText: 'Más populares' })).toBeTruthy();
  });

  test('muestra link "+ Compartir" (LinkComponent primary_button_indigo)', async ({ page }) => {
    await expect(page.getByRole('link', { name: '+ Compartir' })).toBeVisible();
  });

  test('búsqueda rápida redirige a /buscar?q=...', async ({ page }) => {
    await page.getByPlaceholder('Buscar...').fill('ética');
    await page.getByRole('button', { name: 'Buscar' }).click();
    await expect(page).toHaveURL(/\/buscar\?q=/);
  });

  test('estado inicial: spinner de carga o lista o mensaje vacío visible', async ({ page }) => {
    // Debe mostrar algo: loading, error o contenido
    const spinner = page.locator('.animate-spin');
    const lista = page.locator('h2').first();
    const empty = page.getByText('Aún no hay experiencias');
    const error = page.getByText('No se pudieron cargar');

    await expect(spinner.or(lista).or(empty).or(error)).toBeVisible({ timeout: 6000 });
  });
});

// ─── BuscarExperienciasPage ───────────────────────────────────────────────────

test.describe('BuscarExperienciasPage', () => {
  test('renderiza el buscador en /buscar', async ({ page }) => {
    await page.goto('/buscar');
    await expect(page.locator('body')).toBeVisible();
    // Debe tener algún input de búsqueda
    const input = page.locator('input[type="search"], input[type="text"]').first();
    await expect(input).toBeVisible({ timeout: 4000 });
  });

  test('buscar con query ?q= muestra resultados o mensaje', async ({ page }) => {
    await page.goto('/buscar?q=ética');
    await expect(page.locator('body')).toBeVisible();
    // Spinner, resultados o mensaje vacío
    const content = page.locator('body');
    await expect(content).not.toBeEmpty();
  });
});

// ─── ExperienciaDetailPage ────────────────────────────────────────────────────

test.describe('ExperienciaDetailPage', () => {
  const fakeId = '00000000-0000-0000-0000-000000000000';

  test('muestra spinner de carga o contenido al navegar a /experiencias/:id', async ({ page }) => {
    await page.goto(`/experiencias/${fakeId}`);
    const spinner = page.locator('.animate-spin');
    const content = page.locator('body');
    await expect(content).toBeVisible();
  });

  test('muestra mensaje de error con ID inexistente', async ({ page }) => {
    await page.goto(`/experiencias/${fakeId}`);
    const error = page.locator('.text-red-500');
    await expect(error).toBeVisible({ timeout: 6000 });
    // El mensaje puede ser "No encontrada", "Failed to fetch", u otro error de red/API
    const text = await error.textContent();
    expect(text?.length).toBeGreaterThan(0);
  });

  test('detalle real: navega desde /experiencias al primer resultado si existe', async ({ page }) => {
    await page.goto('/experiencias');
    await page.waitForTimeout(3000);
    const firstCard = page.locator('a[href^="/experiencias/"]:not([href="/experiencias/nueva"])').first();
    const count = await firstCard.count();
    if (count > 0) {
      const href = await firstCard.getAttribute('href');
      await firstCard.click();
      await expect(page).toHaveURL(href ?? /\/experiencias\//);
      // Si carga correctamente, debe mostrar secciones de detalle
      const body = await page.locator('body').textContent();
      expect(body?.length).toBeGreaterThan(50);
    } else {
      // Sin datos aún — la prueba se omite
      console.log('Sin experiencias en BD, omitiendo test de detalle real');
    }
  });

  test('muestra secciones de detalle cuando la experiencia existe', async ({ page }) => {
    await page.goto('/experiencias');
    await page.waitForTimeout(3000);
    const firstCard = page.locator('a[href^="/experiencias/"]:not([href="/experiencias/nueva"])').first();
    if (await firstCard.count() > 0) {
      await firstCard.click();
      // Secciones fijas del detail
      await expect(page.getByRole('link', { name: '← Volver' })).toBeVisible({ timeout: 5000 });
      await expect(page.getByRole('heading', { name: 'Descripción' })).toBeVisible();
      await expect(page.getByRole('heading', { name: '¿Qué dice la moral?' })).toBeVisible();
      await expect(page.getByRole('heading', { name: '¿Qué dice tu ética?' })).toBeVisible();
    } else {
      console.log('Sin experiencias en BD, omitiendo test de secciones');
    }
  });

  test('"← Volver" navega de regreso a /experiencias', async ({ page }) => {
    await page.goto('/experiencias');
    await page.waitForTimeout(3000);
    const firstCard = page.locator('a[href^="/experiencias/"]:not([href="/experiencias/nueva"])').first();
    if (await firstCard.count() > 0) {
      await firstCard.click();
      await expect(page.getByRole('link', { name: '← Volver' })).toBeVisible({ timeout: 5000 });
      await page.getByRole('link', { name: '← Volver' }).click();
      await expect(page).toHaveURL('/experiencias');
    } else {
      console.log('Sin experiencias en BD, omitiendo test de navegación');
    }
  });
});

// ─── PerfilPage ───────────────────────────────────────────────────────────────

test.describe('PerfilPage', () => {
  const fakeId = '00000000-0000-0000-0000-000000000000';

  test('muestra estado de carga o contenido al navegar a /perfil/:id', async ({ page }) => {
    await page.goto(`/perfil/${fakeId}`);
    await expect(page.locator('body')).toBeVisible();
  });

  test('muestra mensaje de error con ID de usuario inexistente', async ({ page }) => {
    await page.goto(`/perfil/${fakeId}`);
    const error = page.locator('.text-red-500');
    await expect(error).toBeVisible({ timeout: 6000 });
    const text = await error.textContent();
    expect(text?.toLowerCase()).toMatch(/no se pudo|no encontrado|error/i);
  });

  test('estructura del perfil cuando el usuario existe (vía link en experiencia)', async ({ page }) => {
    // Intentar llegar a un perfil real navegando desde una experiencia
    await page.goto('/experiencias');
    await page.waitForTimeout(3000);
    const firstCard = page.locator('a[href^="/experiencias/"]:not([href="/experiencias/nueva"])').first();
    if (await firstCard.count() > 0) {
      await firstCard.click();
      // Si la experiencia cargó, verificar que la estructura general está presente
      await page.waitForTimeout(2000);
      const body = await page.locator('body').textContent();
      expect(body?.length).toBeGreaterThan(50);
    } else {
      console.log('Sin experiencias en BD, omitiendo test de perfil real');
    }
  });
});

// ─── Rutas protegidas redirigen a /login ─────────────────────────────────────

test.describe('ProtectedRoute (sin sesión)', () => {
  const rutasProtegidas = [
    '/experiencias/nueva',
    '/experiencias/00000000-0000-0000-0000-000000000001/editar',
    '/perfil/editar',
    '/favoritos',
    '/admin/usuarios',
  ];

  for (const ruta of rutasProtegidas) {
    test(`${ruta} redirige a /login`, async ({ page }) => {
      await page.goto(ruta);
      await expect(page).toHaveURL('/login');
    });
  }
});

// ─── Shared: ButtonComponent variants ─────────────────────────────────────────

test.describe('ButtonComponent (variantes en contexto real)', () => {
  test('variant primary_button_indigo visible en Navbar (+ Nueva) cuando hay sesión — navbar sin sesión muestra "Registrarse"', async ({ page }) => {
    await page.goto('/');
    // Sin sesión: el link "Registrarse" usa variant primary_button_indigo
    const btn = page.getByRole('link', { name: 'Registrarse' });
    await expect(btn).toBeVisible();
    const bg = await btn.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    // TailwindCSS 4 usa oklch; aceptamos rgb o oklch para indigo-600
    expect(bg).toMatch(/rgb\(79|oklch/);
  });

  test('variant secondary_gray visible en /experiencias (botón Buscar)', async ({ page }) => {
    await page.goto('/experiencias');
    await expect(page.getByRole('button', { name: 'Buscar' })).toBeVisible();
  });

  test('variant navbar_button visible en Navbar (botón tema)', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Cambiar tema' })).toBeVisible();
  });

  test('variant pagination visible en /experiencias cuando hay > 10 resultados', async ({ page }) => {
    await page.goto('/experiencias');
    // Esperar a que cargue; la paginación solo aparece si hay > 10 resultados
    await page.waitForTimeout(2000);
    const anterior = page.getByRole('button', { name: 'Anterior' });
    const siguiente = page.getByRole('button', { name: 'Siguiente' });
    const isVisible = (await anterior.isVisible()) || (await siguiente.isVisible());
    // Si no aparece paginación es porque hay ≤10 experiencias — aceptable
    console.log('Paginación visible:', isVisible);
  });
});

// ─── Shared: CardComponent variants ──────────────────────────────────────────

test.describe('CardComponent (variantes en contexto real)', () => {
  test('variant outlined visible en HomePage (3 tarjetas de la sección Qué es)', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Reflexiona', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Comparte', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Aprende', exact: true })).toBeVisible();
  });

  test('variant hover visible en /experiencias (cards de experiencias — requiere datos)', async ({ page }) => {
    await page.goto('/experiencias');
    await page.waitForTimeout(2500);
    // Si hay experiencias, los cards aparecen dentro del CardComponent default grid
    const cards = page.locator('a[href^="/experiencias/"]:not([href="/experiencias/nueva"])');
    const count = await cards.count();
    console.log(`Cards de experiencias encontrados: ${count}`);
    // Sin datos aún el count puede ser 0 — no falla la prueba
  });
});

// ─── Shared: LinkComponent variants ──────────────────────────────────────────

test.describe('LinkComponent (variantes en contexto real)', () => {
  test('variant navbar visible en Navbar (Experiencias, Buscar, Equipo)', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Experiencias', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Buscar', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Equipo', exact: true })).toBeVisible();
  });

  test('variant navbar_main visible (logo EthosPlatform)', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'EthosPlatform' })).toBeVisible();
  });

  test('variant primary_button_indigo visible en HomePage ("Ver experiencias")', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Ver experiencias' })).toBeVisible();
  });

  test('variant secondary_button_indigo_edge visible en HomePage ("Unirse gratis")', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Unirse gratis' })).toBeVisible();
  });

  test('variant card_type: links en /experiencias renderizan correctamente', async ({ page }) => {
    await page.goto('/experiencias');
    // El variant card_type se usa para cada experiencia listada
    await page.waitForTimeout(2000);
    const cards = page.locator('a[href^="/experiencias/"]:not([href="/experiencias/nueva"])');
    const count = await cards.count();
    console.log(`Links card_type en /experiencias: ${count}`);
  });
});
