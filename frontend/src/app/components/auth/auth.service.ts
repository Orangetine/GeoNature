import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CookieService } from 'ng2-cookies';
import 'rxjs/add/operator/delay';
import * as moment from 'moment';
import { CruvedStoreService } from '@geonature_common/service/cruved-store.service';
import { ModuleService } from '../../services/module.service';
import { RoutingService } from '@geonature/routing/routing.service';
import { ConfigService } from '@geonature/services/config.service';
import { Provider } from '@geonature/modules/login/providers';

export interface User {
  user_login: string;
  id_role: string;
  id_organisme: number;
  prenom_role?: string;
  nom_role?: string;
  nom_complet?: string;
  providers?: string[];
}

@Injectable()
export class AuthService {
  authentified = false;
  currentUser: any;
  token: string;
  loginError: boolean;
  public isLoading = false;
  private prefix: string = 'gn_';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _http: HttpClient,
    private _cookie: CookieService,
    private cruvedService: CruvedStoreService,
    private _routingService: RoutingService,
    private moduleService: ModuleService,
    public config: ConfigService
  ) {
    this.refreshCurrentUserData();
  }

  refreshCurrentUserData() {
    if (!this.currentUser) {
      this.currentUser = this.getCurrentUser();
    }
  }
  setCurrentUser(user) {
    localStorage.setItem(this.prefix + 'current_user', JSON.stringify(user));
  }

  getAuthProviders(): Observable<Array<Provider>> {
    return this._http.get<Array<Provider>>(`${this.config.API_ENDPOINT}/auth/providers`);
  }

  getCurrentUser() {
    let currentUser = localStorage.getItem(this.prefix + 'current_user');
    return JSON.parse(currentUser);
  }

  loginOrPwdRecovery(data: any): Observable<any> {
    return this._http.post<any>(`${this.config.API_ENDPOINT}/users/login/recovery`, data);
  }

  passwordChange(data: any): Observable<any> {
    return this._http.put<any>(`${this.config.API_ENDPOINT}/users/password/new`, data);
  }

  manageUser(data): any {
    this.setSession(data);
    if (!data.user.providers) {
      // when using public login
      data.user.providers = [];
    }
    const userForFront = {
      user_login: data.user.identifiant,
      prenom_role: data.user.prenom_role,
      id_role: data.user.id_role,
      nom_role: data.user.nom_role,
      nom_complet: data.user.nom_role + ' ' + data.user.prenom_role,
      id_organisme: data.user.id_organisme,
      providers: data.user.providers.map((provider) => provider.name),
    };
    this.setCurrentUser(userForFront);
    this.loginError = false;
  }

  setSession(authResult) {
    localStorage.setItem(this.prefix + 'id_token', authResult.token);
    localStorage.setItem(this.prefix + 'expires_at', authResult.expires);
  }

  signinUser(form: any) {
    return this._http.post<any>(`${this.config.API_ENDPOINT}/auth/login`, form);
  }

  signinPublicUser(): Observable<any> {
    return this._http.post<any>(`${this.config.API_ENDPOINT}/auth/public_login`, {});
  }

  signupUser(data: any): Observable<any> {
    const options = data;
    return this._http.post<any>(`${this.config.API_ENDPOINT}/users/inscription`, options);
  }

  decodeObjectCookies(val) {
    try {
      val = val.replace(/\\(\d{3})/g, function (match, octal) {
        return String.fromCharCode(parseInt(octal, 8));
      });
      val = val.replaceAll('"', '');
      val = val.replaceAll("'", '"');
      val = val.replace(/\\\\/g, '\\');
      return JSON.parse(val);
    } catch (error) {
      console.error('error parsing user cookie');
      return '';
    }
  }

  deleteAllCookies() {
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
  }

  isLoggedIn() {
    return moment().utc().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem(this.prefix + 'expires_at');
    return moment(expiration).utc();
  }

  logout() {
    this.cleanLocalStorage();
    this.cruvedService.clearCruved();
    let logout_url = `${this.config.API_ENDPOINT}/auth/logout`;
    location.href = logout_url;
  }

  private cleanLocalStorage() {
    // Remove only local storage items need to clear when user logout
    localStorage.removeItem(this.prefix + 'current_user');
    localStorage.removeItem(this.prefix + 'id_token');
    localStorage.removeItem(this.prefix + 'expires_at');
    localStorage.removeItem('modules');
  }

  isAuthenticated(): boolean {
    return this._cookie.check('gn_id_token') && this._cookie.get('gn_id_token') !== null;
  }

  handleLoginError() {
    this.isLoading = false;
    this.loginError = true;
  }

  enableLoader() {
    this.isLoading = true;
  }

  disableLoader() {
    this.isLoading = false;
  }

  canBeLoggedWithLocalProvider(): boolean {
    this.refreshCurrentUserData();
    return this.currentUser.providers.includes('local_provider');
  }
}
