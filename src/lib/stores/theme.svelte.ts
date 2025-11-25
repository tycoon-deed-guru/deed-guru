/**
 * deed.guru Theme Store
 * Manages dark/light mode switching with localStorage persistence
 * Default: Dark mode (optimized for professional investors)
 */

import { browser } from '$app/environment';

type Theme = 'dark' | 'light';

class ThemeStore {
	theme = $state<Theme>('dark');

	constructor() {
		if (browser) {
			this.initializeTheme();
		}
	}

	private initializeTheme() {
		// Priority: localStorage > system preference > default (dark)
		const stored = localStorage.getItem('deed-theme') as Theme | null;
		const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light';

		this.theme = stored || systemPreference;
		this.applyTheme(this.theme);

		// Listen for system theme changes (if user hasn't explicitly set preference)
		if (!stored) {
			window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
				if (!localStorage.getItem('deed-theme')) {
					this.setTheme(e.matches ? 'dark' : 'light');
				}
			});
		}
	}

	setTheme(newTheme: Theme) {
		this.theme = newTheme;
		this.applyTheme(newTheme);

		if (browser) {
			localStorage.setItem('deed-theme', newTheme);
		}
	}

	toggleTheme() {
		this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
	}

	private applyTheme(theme: Theme) {
		if (browser) {
			document.documentElement.setAttribute('data-theme', theme);
		}
	}

	// Getters for reactive state
	get isDark() {
		return this.theme === 'dark';
	}

	get isLight() {
		return this.theme === 'light';
	}
}

export const themeStore = new ThemeStore();
