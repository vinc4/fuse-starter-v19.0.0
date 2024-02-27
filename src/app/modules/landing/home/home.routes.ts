import { Routes } from '@angular/router';
import { LandingHomeComponent } from 'app/modules/landing/home/home.component';
import {ProjectService} from "../../admin/dashboards/project/project.service";
import {inject} from "@angular/core";

export default [
    {
        path     : '',
        component: LandingHomeComponent,
        resolve  : {
            data: () => inject(ProjectService).getData(),
        },
    },
] as Routes;
