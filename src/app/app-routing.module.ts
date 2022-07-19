//URLのパス設定を行うファイル。
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'
import { DashboardComponent } from './dashboard/dashboard.component';
import { MemberDetailComponent } from './member-detail/member-detail.component';
import { MembersComponent } from './members/members.component';

//ルート情報を定義
const routes: Routes = [
  //トップページのパスを指定し、redirectToにトップページに行ったら自動でそこに遷移(リダイレクト)してほしいページのパスを指定。fullは、パスが完全一致した場合にそこに遷移するようにするもの。
  { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  //URLのパス名, パスにアクセスした際に、指定したコンポーネントを表示する設定
  { path: 'dashboard', component: DashboardComponent},
  //:idには社員番号が設定される。:idと書くことでAngularのルーターの機能からidのパラメータで値を参照できる。
  { path: 'detail/:id', component: MemberDetailComponent},
  { path: 'members', component: MembersComponent}
]

@NgModule({
  imports: [
    //ルート情報を渡してルーティングを有効にする
    RouterModule.forRoot(routes)
  ],
  //rooting.moduleが読み込まれるapp.moduleの方で使えるようにするためにexports
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
