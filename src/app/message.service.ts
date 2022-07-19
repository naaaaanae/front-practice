//メッセージのログを扱うserviceのファイル
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  //messagesというプロパティを文字列の配列で設定
  messages: string[] = [];
  
  //自身のmessagesプロパティに受け取ったmessageを追加するメソッド
  add(message: string) {
    this.messages.push(message);
  }
  //自身のmessagesプロパティをリセットするメソッド
  clear() {
    this.messages = [];
  }
}
