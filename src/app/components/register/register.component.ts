import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast/toast.service';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';

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
    private toastService: ToastService,
    private spinnerDialog: SpinnerDialog,
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
    this.spinnerDialog.show(null, 'Please wait...', true);
    const result = await this.authService.SignUp(this.form.value);

    if (result === 'ok') {
      this.spinnerDialog.hide();
      await this.router.navigate(['tabs/dictionary']);
      this.form.reset();
    } else {
      this.spinnerDialog.hide();
      this.toastService.showToast('Something is going wrong...', '#ec5252');
    }
  }

  public async toLoginPage() {
    await this.router.navigate(['login']);
  }


}
