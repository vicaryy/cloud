import { Component, OnDestroy, OnInit } from '@angular/core';
import { Alert, AlertFactory, ErrorAlert, InfoAlert, SuccessAlert } from '../../models/alert.models';
import { Subscription } from 'rxjs';
import { AlertService } from '../../services/alert.service';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [MatButton],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.scss'
})
export class AlertsComponent implements OnInit, OnDestroy {
    alerts: Alert[] = [];
    private subAlerts!: Subscription;

    constructor(private alertService: AlertService) { }

    ngOnInit(): void {
        this.subAlerts = this.alertService.alert$.subscribe(alert => {
            this.alerts = [...this.alerts, alert];
            setTimeout(() => this.closeAlert(alert.id()), 6000);
        });
    }

    ngOnDestroy(): void {
        this.subAlerts.unsubscribe();
    }

    closeAlert(id: number) {
        this.alerts = this.alerts.filter(e => e.id() !== id);
    }

    isError(alert: Alert) {
        return alert instanceof ErrorAlert;
    }

    isSuccess(alert: Alert) {
        return alert instanceof SuccessAlert;
    }

    isInfo(alert: Alert) {
        return alert instanceof InfoAlert;
    }
}
