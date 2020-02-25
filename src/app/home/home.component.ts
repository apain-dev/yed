import {Component, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';

export interface TokenResponse {
  access_token: string;
  expires_in: number; // Le temps pour lequel ton token est encore bon ( en ms )
  token_type: string; // Ca sert à rien
  scope: any; // Balek
  refresh_token: string; // Pas forcement besoin de ça
  account_id: string; // Balek
  account_username: string; // le username du gars qui vient de se connecter
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  /** Based on the screen size, switch from standard to one column per row */
  private authorizeUrl = `${environment.imgurApi}/oauth2/authorize`;
  public helper = 'Veuillez clicker sur le bouton imgur';
  public error;

  constructor(private route: ActivatedRoute, private httpService: HttpClient, private router: Router) {
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params: { [key: string]: string }) => {
      if (params.code) {
        this.helper = 'Obtention du token à partir du code ' + params.code;
        this.getToken(params.code);
      }
    });
  }

  public authorize() {
    window.location.href = this.authorizeUrl + `?client_id=${environment.clientId}&response_type=code&state=APPLICATION_STATE`;
  }

  private getToken(code: string) {
    this.httpService.post(`${environment.imgurApi}/oauth2/token`, {
      code,
      client_id: environment.clientId,
      client_secret: environment.clientSecret,
      grant_type: 'authorization_code',
    }).subscribe((response: TokenResponse) => {
      this.helper = `Token obtenu avec succés: ${response.access_token}`;
      this.clearQuery();
    }, (err) => {
      this.helper = 'Une erreur est survenue';
      this.error = err;
    });
  }

  private clearQuery() {
    this.router.navigate(
      ['.'],
      {relativeTo: this.route, queryParams: {}}
    );
  }
}
