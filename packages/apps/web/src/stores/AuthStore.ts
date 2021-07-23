import axios, { AxiosInstance } from "axios";
import { action, computed, observable, makeObservable } from "mobx";
import { HEMBIO_API_URL } from "~/constants";

export class AuthStore {
  public isReady = false;
  public accessToken?: string;
  public userId?: string;
  public username?: string;
  public error?: Error;
  public qrCode?: string;
  public isTwoFactorNeeded = false;

  private client: AxiosInstance;

  public constructor() {
    this.client = axios.create({
      baseURL: HEMBIO_API_URL,
      withCredentials: true,
    });

    this.client.interceptors.request.use((req) => {
      if (this.accessToken) {
        req.headers["Authorization"] = `Bearer ${this.accessToken}`;
      }
      return req;
    });

    setInterval(() => {
      this.refreshAccessToken();
    }, 1000 * 60 * 10);
    this.refreshAccessToken();

    makeObservable(this, {
      isReady: observable,
      accessToken: observable,
      qrCode: observable,
      isTwoFactorNeeded: observable,
      userId: observable,
      username: observable,
      error: observable,
      isAuthenticated: computed,
      setAuthenticated: action,
      setError: action,
      setQrCode: action,
      setTwoFactorNeeded: action,
      setUserId: action,
    });
  }

  public get isAuthenticated(): boolean {
    return (
      this.isReady && !!this.accessToken && !!this.userId && !!this.username
    );
  }

  public async refreshAccessToken(): Promise<void> {
    try {
      const res = await this.client.get("/auth/access-token");
      if (res.status === 200) {
        this.setAuthenticated(res.data);
        this.fetchQrCode();
        return;
      }
    } catch {
      // TODO: Error handling
    }
    this.setAuthenticated(undefined);
  }

  public async signIn(username: string, password: string): Promise<void> {
    try {
      const res = await this.client.post("/auth/sign-in", {
        username,
        password,
      });
      if (res.status === 200) {
        if (res.data.tfa) {
          this.setUserId(res.data.userId);
          this.setTwoFactorNeeded(true);
        } else {
          this.setAuthenticated(res.data);
        }
        this.fetchQrCode();
        return;
      }
    } catch (e) {
      this.setError(e);
    }
    this.setAuthenticated(undefined);
  }

  public async twoFactor(tfaCode: string): Promise<void> {
    try {
      const res = await this.client.post("/auth/tfa", {
        userId: this.userId,
        tfaCode,
      });
      if (res.status === 200) {
        this.setTwoFactorNeeded(false);
        this.setAuthenticated(res.data);
        return;
      }
    } catch (e) {
      this.setError(e);
    }
    this.setTwoFactorNeeded(false);
    this.setAuthenticated(undefined);
  }

  public signOut(): void {
    this.client.get("/auth/sign-out");
    this.setAuthenticated(undefined);
  }

  public async fetchQrCode(): Promise<void> {
    try {
      const res = await this.client.get("/auth/tfa/qr");
      if (res.status === 200) {
        this.setQrCode(res.data.qrCode);
        return;
      }
    } catch (e) {
      //
    }
    this.qrCode = undefined;
  }

  public setUserId(userId: string): void {
    this.userId = userId;
  }

  public setQrCode(qrCode: string): void {
    this.qrCode = qrCode;
  }

  public setTwoFactorNeeded(isTwoFactorNeeded: boolean): void {
    this.isTwoFactorNeeded = isTwoFactorNeeded;
  }

  public setError(e: Error): void {
    this.error = e;
  }

  public setAuthenticated(data?: Record<string, string>): void {
    if (!data) {
      this.userId = undefined;
      this.username = undefined;
      this.accessToken = undefined;
    } else {
      if (data.userId) {
        this.userId = data.userId;
      }
      if (data.username) {
        this.username = data.username;
      }
      if (data.accessToken) {
        this.accessToken = data.accessToken;
      }
    }
    this.isReady = true;
  }
}
