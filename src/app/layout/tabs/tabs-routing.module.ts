import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'dictionary',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('src/app/pages/dictionary/dictionary.module').then(m => m.DictionaryModule)
          }
        ]
      },
      {
        path: 'sets',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('src/app/pages/sets/sets.module').then(m => m.SetsPageModule)
          }
        ]
      },
      {
        path: 'statistics',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('src/app/pages/statistics/statistics.module').then(m => m.StatiscticsPageModule)
          }
        ]
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('src/app/pages/profile/profile.module').then(m => m.ProfilePageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/dictionary',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/dictionary',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
