import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Member } from './member';
import { MessageService } from './message.service';
import { MEMBERS } from './mock-members';
//pipeの中に書くオペレーター関数をインポート
import { catchError, map, tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  //HTTPClientが利用するURLをプロパティに追加する。これがサーバーのURLとして使える
  private membersUrl = 'api/members';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  //MemberServiceの中で使えるようにDIする
  constructor(
    private http: HttpClient,
    private messageService: MessageService
    ) {}

   //社員のmockデータを取得するためのメソッドを追加
   //getMemberメソッドで戻り値にMemberインターフェイス（配列）を指定
   getMembers(): Observable<Member[]> {
    //非同期処理。of()に渡したいデータを記入→Observableというオブジェクトに変換して返す
    // return of(MEMBERS);

    //HTTPクライアントで社員のデータを取得する
    //HTTPClientのgetメソッドを利用し、ジェネリックで返り値(Memberデータの配列)を指定し、membersUrlを受け取ってこのgetメソッドを実行するようにする
    //.pipeでデータを受け取るまでの中間処理を書く。上から順に実行される。
    //①getメソッドで受け取ったレスポンスをtap関数で受け取る
    //②tap関数で受け取った値を確認する(今まで直接memberSevice内のaddメソッドで行っていた内容をここで行う。)
    //③エラーが発生した時はcarchErrorメソッドの中の処理が行われる
    return this.http.get<Member[]>(this.membersUrl)
    .pipe(
      tap(members => this.log('社員データを取得しました。')),
      catchError(this.handleError<Member[]>('getMemers',[]))
    );
  }

  getMember(id: number): Observable<Member>{
    //member.idが渡されたidと等しければそのデータを返す(idがマッチするものを探して、マッチすればデータを返す)
    // return of(MEMBERS.find(member => member.id === id));
    const url = `${this.membersUrl}/${id}`;
    return this.http.get<Member>(url)
    .pipe(
      tap(member => this.log(`社員データ(id=${id})を取得しました。`)),
      catchError(this.handleError<Member>(`getMember id=${id}`))
    );
  }

  updateMember(member: Member): Observable<any> {
    //HTTPClientのputメソッドでは3つ引数を渡す
    //1. 取得するURL
    //2. 変更するデータ
    //3. httpの設定
    return this.http.put(this.membersUrl, member, this.httpOptions)
    .pipe(
      tap(_ => this.log(`社員データ(id=${member.id})を変更しました`)),
      catchError(this.handleError<any>('updateMember'))
    )
  }

  addMember(member: Member): Observable<Member> {
    return this.http.post(this.membersUrl, member, this.httpOptions)
    .pipe(
      tap((newMember: Member) => this.log(`社員データ(id=${newMember.id})を追加しました`)),
      catchError(this.handleError<any>('addMember'))
    )
  }

  //社員名でもIDでも削除できるように引数に指定
  deleteMember(member: Member | number): Observable<Member> {
    const id = typeof member === 'number' ? member : member.id;
    const url = `${this.membersUrl}/${id}`
    return this.http. delete<Member>(url, this.httpOptions)
    .pipe(
      tap(_ => this.log(`社員データ(id=${id})を削除しました`)),
      catchError(this.handleError<any>('deleteMember'))
    )
  }

  searchMembers(keyword: string): Observable<Member[]> {
    if (!keyword.trim()) {
      return of ([]);
    }
    return this.http.get<Member[]>(`${this.membersUrl}/?name=${keyword}`)
    .pipe(
      tap(_ => this.log(`${keyword}にマッチする社員データが見つかりました`)),
      catchError(this.handleError<Member[]>('searchMember', []))
    );
  }

  //messageServiceのaddメソッドを呼び出すためだけのprivateメソッド
  private log(message: string) {
    this.messageService.add(`MessageService: ${message}`)
  }

  //引数では実行したメソッド名を受け取る。resultという引数を使ってエラーによってアプリケーションが止まらないように安全な値をコンポーネントに渡せるようにする
  private handleError<T>(operation = 'operation', result?: T){
    //引数にエラーオブジェクトが渡ってくる。consoleでエラー内容を出力。エラーオブジェクトに入っているエラーメッセージをログに追加
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} 失敗: ${error.message}`);
      //アプリケーションが止まらないようにresultを返す。as文を使うことで必ず受け取った型になるように型キャストを行っている。
      return of(result as T)
    }

  }
}
