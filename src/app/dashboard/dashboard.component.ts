import { Component, OnInit } from '@angular/core';
import { Member } from '../member';
import { MemberService } from '../member.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  members: Member[] = [];
  //社員データを使用できるように、MemberServiceをDIする
  constructor(private memberService: MemberService) { }

  ngOnInit(): void {
    this.getMembers();
  }

  //MemberServiceを使って社員一覧を取得
  getMembers(): void {
    //memberServiceのgetMembersを実行してデータを取得し、渡ってきた社員データをこのクラスのmembersプロパティに代入
    //sliceメソッドを使って1~5番目の社員を選択
    this.memberService.getMembers()
    .subscribe(members => this.members = members.slice(1,5));
  }

}
