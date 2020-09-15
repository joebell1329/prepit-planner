import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import createAuth0Client, { Auth0Client, RedirectLoginResult } from '@auth0/auth0-spa-js';
import { BehaviorSubject, combineLatest, from, Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public auth0Client$: Observable<Auth0Client>;
  public isAuthenticated$: Observable<boolean>;
  public handleRedirectCallback$: Observable<RedirectLoginResult>;

  private userProfileSubject$ = new BehaviorSubject<any>(null);
  public userProfile$ = this.userProfileSubject$.asObservable();
  public fitbitUserId$ = this.userProfile$
    .pipe(
      map(profile => profile.sub.slice(profile.sub.indexOf('|') + 1))
    );

  private loggedInSubject$ = new BehaviorSubject<boolean>(false);
  public loggedIn$ = this.loggedInSubject$.asObservable();

  constructor(private router: Router, private config: ConfigService) {
    this.initialiseObservables();

    // On initial load, check authentication state with authorization server
    // Set up local auth streams if user is already authenticated
    this.localAuthSetup();

    // Handle redirect from Auth0 login
    this.handleAuthCallback();
  }

  private initialiseObservables(): void {
    this.auth0Client$ = this.config.config$.pipe(
      take(1),
      switchMap(config => (from(
        createAuth0Client({
          domain: config.auth.domain,
          client_id: config.auth.client_id,
          audience: config.auth.audience,
          redirect_uri: `${window.location.origin}`
        })) as Observable<Auth0Client>)),
      shareReplay(1),
      catchError(err => throwError(err))
    );

    this.isAuthenticated$ = this.auth0Client$.pipe(
      concatMap((client: Auth0Client) => from(client.isAuthenticated())),
      tap(res => this.loggedInSubject$.next(res))
    );

    this.handleRedirectCallback$ = this.auth0Client$.pipe(
      concatMap((client: Auth0Client) => from(client.handleRedirectCallback()))
    );
  }

  // When calling, options can be passed if desired
  // https://auth0.github.io/auth0-spa-js/classes/auth0client.html#getuser
  public getUser$(options?): Observable<any> {
    return this.auth0Client$.pipe(
      concatMap((client: Auth0Client) => from(client.getUser(options))),
      tap(user => this.userProfileSubject$.next(user))
    );
  }

  private localAuthSetup(): void {
    // This should only be called on app initialization
    // Set up local authentication streams
    const checkAuth$ = this.isAuthenticated$.pipe(
      concatMap((loggedIn: boolean) => {
        if (loggedIn) {
          // If authenticated, get user and set in app
          // NOTE: you could pass options here if needed
          return this.getUser$();
        }
        // If not authenticated, return stream that emits 'false'
        return of(loggedIn);
      })
    );
    checkAuth$.subscribe();
  }

  public login(redirectPath: string = '/'): void {
    // A desired redirect path can be passed to login method
    // (e.g., from a route guard)
    // Ensure Auth0 client instance exists
    combineLatest([this.config.config$, this.auth0Client$])
      .pipe(
        (take(1))
      )
    .subscribe(([config, client]) => {
      // Call method to log in
      client.loginWithRedirect({
        redirect_uri: `${window.location.origin}`,
        audience: config.auth.audience,
        appState: { target: redirectPath }
      });
    });
  }

  private handleAuthCallback(): void {
    // Call when app reloads after user logs in with Auth0
    const params = window.location.search;
    if (params.includes('code=') && params.includes('state=')) {
      let targetRoute: string; // Path to redirect to after login processsed
      const authComplete$ = this.handleRedirectCallback$.pipe(
        // Have client, now call method to handle auth callback redirect
        tap(cbRes => {
          // Get and set target redirect route from callback results
          targetRoute = cbRes.appState && cbRes.appState.target ? cbRes.appState.target : '/';
        }),
        concatMap(() => {
          // Redirect callback complete; get user and login status
          return combineLatest([
            this.getUser$(),
            this.isAuthenticated$
          ]);
        })
      );
      // Subscribe to authentication completion observable
      // Response will be an array of user and login status
      authComplete$.subscribe(([ user, loggedIn ]) => {
        // Redirect to target route after callback processing
        this.router.navigate([ targetRoute ]);
      });
    }
  }

  public logout(): void {
    // Ensure Auth0 client instance exists
    combineLatest([ this.config.config$.pipe(take(1)), this.auth0Client$ ])
      .subscribe(([config, client]) => {
        // Call method to log out
        client.logout({
          client_id: config.auth.client_id,
          returnTo: `${window.location.origin}`,
          // federated: true
        });
      });
  }
}
