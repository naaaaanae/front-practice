import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Observable, Subject, switchMap } from 'rxjs';
import { Member } from '../member';
import { MemberService } from '../member.service';

@Component({
  selector: 'app-member-search',
  templateUrl: './member-search.component.html',
  styleUrls: ['./member-search.component.css']
})
export class MemberSearchComponent implements OnInit {
  members$: Observable<Member[]>;
  //Subjectはrxjsのクラスで、Observableのデータを流す役目（Observableを継承している）
  private searchTerms = new Subject<string>();

  constructor(private memberService: MemberService) { }

  search(keyword: string): void {
    //渡したデータをpipeで指定している中間処理を通してsubscribeしている部分にデータを送れる
    //任意のタイミングでデータを取得したい時にSubjectを使用する
    this.searchTerms.next(keyword); //コールして値(keyword)を送信
  }

  ngOnInit(): void {
    this.members$ = this.searchTerms.pipe(
      //キーボード入力の後、300ms待って実行に映る
      debounceTime(300),
      //直前のデータと同じ場合は処理を実行しない
      distinctUntilChanged(),
      //検索キーワードを受け取る度に、新しいObservableを返し、members$に値をセット
      //searchTermsで渡ってきた検索キーワードをswitchMapで受け取った後に、そのコールバックで、searchMembersメソッドにこの検索キーワードを渡してHTTPリクエストを実行する
      switchMap((keyword: string) => this.memberService.searchMembers(keyword))
    );
  }



}
