import { expect, test } from '@playwright/test';

const PROJECT_SLUGS = [
  'chatttt',
  'lingo',
  'docs',
  'flight-predictor',
  'editum-ide',
  'ecommerce-platform',
];

const CHAPTER_ROUTES = ['/about', '/work', '/experience', '/skills', '/coding', '/contact'];

test.describe('Chaitanya Agarkar Portfolio E2E', () => {
  test('loads homepage without console errors or horizontal overflow', async ({
    page,
    isMobile,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        const url = msg.location()?.url ?? '';
        // Ignore third-party LeetCode network fetch failures in offline/restricted environments
        if (
          !text.includes('leetcode-api-faisalshohag') &&
          !url.includes('leetcode-api-faisalshohag')
        ) {
          errors.push(`${text} (${url})`);
        }
      }
    });

    await page.goto('/');
    // Dismiss intro cleanly if visible without racing exit animation
    const skipBtn = page.getByRole('button', { name: 'Skip Intro' });
    if (await skipBtn.isVisible().catch(() => false)) {
      await skipBtn.click({ force: true }).catch(() => undefined);
    }

    await expect(
      page.getByRole('heading', { level: 1, name: 'CHAITANYA AGARKAR' }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: /Chaitanya Agarkar Home/i })).toContainText(
      '<Chaieeetanya/>',
    );
    await expect(page.locator('header').getByRole('button', { name: /sound|audio/i })).toHaveCount(0);
    await expect(page.getByRole('button', { name: /Mute sphere physics sound/i })).toBeVisible();

    const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bodyBg).toBe('rgb(238, 238, 238)');

    if (isMobile) {
      await expect(page.getByRole('heading', { name: 'Explore by Section' })).toBeVisible();
    } else {
      await expect(page.getByText('BEYOND WRITING CODE.')).toBeVisible();
      await expect(page.getByText('BEHIND THE SYSTEMS.')).toBeVisible();
      await expect(page.getByText('THE TOOLS BEHIND THE ENGINEERING.')).toBeVisible();
    }

    const viewportWidth = page.viewportSize()?.width ?? 1280;
    const layoutMetrics = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }));
    expect(layoutMetrics.scrollWidth).toBeLessThanOrEqual(viewportWidth + 1);
    expect(layoutMetrics.innerWidth).toBeLessThanOrEqual(viewportWidth + 1);
    expect(errors).toEqual([]);
  });

  test('omits story game and resume links while supporting interactive Hero 3D spheres palette', async ({
    page,
  }) => {
    await page.goto('/');
    const skipBtn = page.getByRole('button', { name: 'Skip Intro' });
    if (await skipBtn.isVisible().catch(() => false)) {
      await skipBtn.click({ force: true }).catch(() => undefined);
    }

    await expect(page.getByRole('button', { name: /3D Story/i })).toHaveCount(0);
    await expect(page.getByRole('link', { name: /Download Resume/i })).toHaveCount(0);

    const accentBtn = page.getByRole('button', { name: /Cycle 3D sphere accent color/i });
    await expect(accentBtn).toBeVisible();
    await expect(accentBtn).toContainText('Cobalt');
    await accentBtn.click();
    await expect(accentBtn).toContainText('Crimson');
  });

  test('supports dark and light studio theme switching cleanly', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const darkToggle = page.getByRole('button', { name: /Switch to dark theme/i });
    await darkToggle.click();

    await expect(page.locator('html')).toHaveClass(/dark/);
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(11, 12, 16)');

    const lightToggle = page.getByRole('button', { name: /Switch to light theme/i });
    await lightToggle.click();

    await expect(page.locator('html')).not.toHaveClass(/dark/);
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(238, 238, 238)');
  });

  test('navigates section chapter routes, project routes, and 404 page cleanly', async ({
    page,
  }) => {
    for (const route of CHAPTER_ROUTES) {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator('main')).toBeVisible();
    }

    await page.goto('/projects');
    await expect(
      page.getByRole('heading', { level: 1, name: 'SELECTED ENGINEERING PROJECTS.' }),
    ).toBeVisible();

    for (const slug of PROJECT_SLUGS) {
      const response = await page.goto(`/projects/${slug}`);
      expect(response?.status()).toBe(200);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.getByText('System Architecture')).toBeVisible();
    }

    await page.goto('/projects/does-not-exist');
    await expect(page.getByText('COORDINATES UNKNOWN.')).toBeVisible();
  });

  test('verifies external link security attributes cleanly', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('a[href*="resume"]')).toHaveCount(0);

    const blankLinks = page.locator('a[target="_blank"]');
    const count = await blankLinks.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const rel = await blankLinks.nth(i).getAttribute('rel');
      expect(rel).toContain('noopener');
    }
  });

  test('supports command interface, contact validation, and mobile chapter routing', async ({
    page,
    isMobile,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    if (isMobile) {
      const viewportWidth = page.viewportSize()?.width ?? 412;
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(overflow).toBe(false);

      const menuBtn = page.getByRole('button', { name: /Open navigation menu/i });
      await menuBtn.click();
      const dialog = page.getByRole('dialog', { name: /Mobile navigation menu/i });
      await expect(dialog).toBeVisible();
      await dialog.getByRole('link', { name: /Contact/i }).click();
      await expect(page).toHaveURL(/\/contact$/);
      expect(
        await page.evaluate((vw) => document.documentElement.scrollWidth <= vw + 1, viewportWidth),
      ).toBe(true);
    } else {
      await page.keyboard.press('Control+k');
      await expect(page.getByPlaceholder(/Type a command/i)).toBeVisible();
      await page.keyboard.press('Escape');
    }

    // Contact form validation check
    const submitBtn = page.getByRole('button', { name: /Open Email Client|Send Message/i });
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click();
    await expect(
      page.getByText(/Please enter at least 2 characters for your name/i),
    ).toBeVisible();
  });

  test('handles WebGL unavailability and LeetCode API failure gracefully', async ({
    page,
    isMobile,
  }) => {
    await page.addInitScript(() => {
      const origGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type: string, ...args: unknown[]) {
        if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') {
          return null;
        }
        return origGetContext.apply(this, [type, ...(args as [])]);
      };
    });

    await page.route('**/leetcode-api-faisalshohag.vercel.app/**', (route) => route.abort());
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    await expect(
      page.getByRole('heading', { level: 1, name: 'CHAITANYA AGARKAR' }),
    ).toBeVisible();

    if (isMobile) {
      await page.goto('/coding');
    }

    await expect(page.getByText('LEETCODE CODING STATISTICS.')).toBeVisible();
    await expect(page.getByText('548')).toBeVisible();
  });
});
