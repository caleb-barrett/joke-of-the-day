import { beforeEach, describe, expect, it, vi } from 'vitest';

import { isLaunchedAtStartup, registerStartup } from '@/main/startup.service';

const { mockApp } = vi.hoisted(() => ({
  mockApp: { isPackaged: false, setLoginItemSettings: vi.fn() },
}));

vi.mock('electron', () => ({ app: mockApp }));

describe('isLaunchedAtStartup', () => {
  it('returns true when --startup is present', () => {
    expect(isLaunchedAtStartup(['JokeOfTheDay.exe', '--startup'])).toBe(true);
  });

  it('returns false when --startup is absent', () => {
    expect(isLaunchedAtStartup(['JokeOfTheDay.exe'])).toBe(false);
  });
});

describe('registerStartup', () => {
  beforeEach(() => {
    mockApp.setLoginItemSettings.mockClear();
  });

  it('does not register when the app is not packaged', () => {
    mockApp.isPackaged = false;
    registerStartup();
    expect(mockApp.setLoginItemSettings).not.toHaveBeenCalled();
  });

  it('registers the login item with --startup when packaged', () => {
    mockApp.isPackaged = true;
    registerStartup();
    expect(mockApp.setLoginItemSettings).toHaveBeenCalledWith(
      expect.objectContaining({ openAtLogin: true, args: ['--startup'] }),
    );
  });
});
