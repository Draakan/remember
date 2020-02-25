import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  public title: string = 'Register';

  public form: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loaderService: LoaderService,
    private toastService: ToastService,
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      date: new FormControl(null, [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(3)])
    });
  }

  public async register() {
    const loader = await this.loaderService.showLoader();
    const result = await this.authService.SignUp(this.form.value);

    if (result === 'ok') {
      await loader.dismiss();
      await this.router.navigate(['tabs/dictionary']);
      this.form.reset();
    } else {
      await loader.dismiss();
      await this.toastService.showToast('Something is going wrong...', 'danger');
    }
  }

  public async toLoginPage() {
    await this.router.navigate(['login']);
  }


}
