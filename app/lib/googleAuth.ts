export async function getGoogleIdToken(): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error('Google sign-in is only available in the browser');
  }

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error('Google Client ID is not configured on the frontend');
  }

  // Load Google Identity Services script if not already loaded
  if (!(window as any).google?.accounts?.oauth2) {
    await new Promise<void>((resolve, reject) => {
      const existingScript = document.querySelector<HTMLScriptElement>(
        'script[src="https://accounts.google.com/gsi/client"]',
      );
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve());
        existingScript.addEventListener('error', () =>
          reject(new Error('Failed to load Google script')),
        );
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google script'));
      document.head.appendChild(script);
    });
  }

  const google = (window as any).google;
  if (!google?.accounts?.oauth2) {
    throw new Error('Google OAuth2 client not available');
  }

  // Use OAuth2 token client with a user-initiated popup instead of One Tap / FedCM.
  return new Promise<string>((resolve, reject) => {
    try {
      const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'openid email profile',
        callback: (response: any) => {
          if (response && response.access_token) {
            resolve(response.access_token);
          } else {
            reject(new Error('No access token returned from Google'));
          }
        },
        error_callback: (err: any) => {
          if (err && err.type === 'popup_closed') {
            reject(new Error('Google sign-in popup was closed'));
          } else {
            reject(new Error('Google sign-in failed'));
          }
        },
      });

      // Opens a popup when called in response to a user click.
      tokenClient.requestAccessToken();
    } catch (error) {
      reject(error instanceof Error ? error : new Error('Google sign-in failed'));
    }
  });
}

