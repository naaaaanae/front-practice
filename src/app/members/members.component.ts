import { Component, OnInit } from '@angular/core';
import { Member } from '../member';
import { MemberService } from '../member.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {

  //プロパティを追加(1人の名前だけ固定で渡す場合)
  // member= '田中太郎';

  //外部ファイルに作成した社員一覧のinterfaceを配列で呼び出し、オブジェクトデータで実際の値を指定してあげる
  //membersプロパティのデータ型をMEMBER[]に定義
  members: Member[];

  //constructorの引数でserviceのimportの設定を行う（コンポーネントでserviceを呼び出し、データの取得ができるようにする）
  constructor(private memberService: MemberService) { }

  ngOnInit(): void {
    // getMembersメソッドを実行
    //外部からデータを取得する場合はngOnInitの中で行う
    this.getMembers();
  }

  //引数で渡されたmemberをselectedMemberに指定する
  //選択した際にメッセージを追加するメソッドもここに追加
  // onSelect(member: Member): void {
  //   this.selectedMember = member;
  //   this.messageService.add(`MembersComponent: 社員データ(id=${member.id})が選択されました`);
  // }

  //member.serviceを利用してmockデータを取得するメソッドを追加
  getMembers(): void {
    this.memberService.getMembers() //Observableで値が返される
    //of関数で渡されたmembers配列を受け取り、受け取った関数をここで定義し、自身のmembersプロパティに渡ってきたmockのmembersをセット
     .subscribe(members => this.members = members);
  }

  add(name: string): void{
    //名前の空白スペースを取り除く
    name = name.trim();
    if(!name) { return; }
    this.memberService.addMember({ name } as Member)
    .subscribe(member => {
      this.members.push(member);
    });
  }

  delete(member: Member): void{
    //members配列から、ここで渡ってきた社員データとマッチしないものを探し、それを再代入している
    //つまり、削除ボタンを押して渡ってきた社員データを除外している
    this.members = this.members.filter(m => m !== member);
    this.memberService.deleteMember(member)
    .subscribe(); //subscribeメソッドを実行しないと、Observableが返され、httpメソッドが実行されない。
  }
}
