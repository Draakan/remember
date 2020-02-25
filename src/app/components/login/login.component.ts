import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { LoaderService } from '../../services/loader/loader.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {

  public title: string = 'Sign In';

  public form: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loaderService: LoaderService,
    private toastService: ToastService,
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(3)])
    });
  }

  ngAfterViewInit() {
    this.loaderService.preload.next(false);
  }

  public async signIn() {
    const loader = await this.loaderService.showLoader();
    const result = await this.authService.signInWithEmailAndPassword(this.form.value);

    if (result === 'ok') {
      await this.router.navigate(['tabs/dictionary']);
      await loader.dismiss();
      this.form.reset();
    } else {
      await loader.dismiss();
      await this.toastService.showToast('Bad credentials', 'danger');
    }
  }

  public toRegisterPage() {
    this.router.navigate(['register']);
    this.form.reset();
  }

}
