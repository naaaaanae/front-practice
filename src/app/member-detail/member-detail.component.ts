import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../member';
import { MemberService } from '../member.service';
import { Location }from '@angular/common';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  // memberというプロパティにMemberインターフェイスを指定
  @Input() member: Member;

  constructor(
    //URLのパラメータやハッシュプラグメントを取得するためのサービス
    private route: ActivatedRoute,
    private memberService: MemberService,
    //ブラウザバックや進むなどのブラウザの機能をAngularを通して使うためのサービス
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getMember();
  }
  //ActivatedRouteを使ってURLのidパラメータを取得
  getMember(): void{
    //snapshotというオブジェクトには、直前のルート情報が含まれており、そこから参照できるパラメータが格納されている場所がparamMap。その中でidパラメータを取得
    //先頭に+をつけることで、文字列で渡ってきたidを数字に変換
    const id = +this.route.snapshot.paramMap.get('id');
    //取得できたidを使ってmembeServiceに定義してある社員の取得メソッドに渡す。
    this.memberService.getMember(id)
    .subscribe(member => this.member = member);
  }

  goBack(): void{
    this.location.back();
  }

  //サーバにデータを保存したレスポンスが返ってくるupdateMemberメソッドを呼び、レスポンスが返ってきたら一つ前の画面を戻る
  save(): void{
    this.memberService.updateMember(this.member)
    .subscribe(() => this.goBack())
  }

}
