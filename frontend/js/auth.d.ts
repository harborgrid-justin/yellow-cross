type AlertType = 'success' | 'error' | 'info';
declare function setupAuthListeners(): void;
declare function setupAccessibility(): void;
declare function handleLogin(e: Event): Promise<void>;
declare function handleRegister(e: Event): Promise<void>;
declare function handleSocialAuth(e: Event): void;
declare function showAlert(type: AlertType, message: string): void;
declare function simulateAPICall(delay: number): Promise<void>;
declare function checkAuth(): void;
declare function logout(): void;
//# sourceMappingURL=auth.d.ts.map