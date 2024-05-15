import {Injectable, Signal, WritableSignal} from '@angular/core';
import {Observable} from "rxjs";
import {
  Auth,
  authState,
  signInWithPopup,
  signOut,
  User,
  GoogleAuthProvider,
  signInWithEmailAndPassword
} from "@angular/fire/auth";
import {toSignal} from "@angular/core/rxjs-interop";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly obsUser: Observable<User | null> = authState(this.fbAuth)
  readonly sigObsUser: Signal<User | null> = toSignal(this.obsUser, {initialValue: null})

  constructor(private fbAuth: Auth, private router: Router) {
    this.obsUser.subscribe({next(user) {
        if (user === null) {router.navigate(['/auth'])} else {
          router.navigate(['/main-menu'])
        }
        console.log(user)}})
  }

  getToken() {
    if (!this.fbAuth.currentUser) {
      return "";
    }
    return this.fbAuth.currentUser.getIdToken()
  }

  async logout(): Promise<void> {
    return signOut(this.fbAuth);
  }

  async loginGoogle(): Promise<void> {
    return signInWithPopup(this.fbAuth, new GoogleAuthProvider()).then(
      console.log,
      console.error,
    )
  }

  async loginEmail(email: string, password: string, errorMsg: WritableSignal<string>): Promise<void> {
    signInWithEmailAndPassword(this.fbAuth, email, password).catch((error) => {
      switch(error.code) {
        case 'auth/user-not-found':
          errorMsg.set('Utilisateur non trouvé')
          break;
        case 'auth/wrong-password':
          errorMsg.set('Mot de passe incorrect')
          break;
        case 'auth/invalid-credential':
          errorMsg.set('Email ou mot de passe invalide')
          break;
        default:
          console.log(error.code)
          errorMsg.set('Une erreur inconnue est survenue')
      }
    })
  }
}
