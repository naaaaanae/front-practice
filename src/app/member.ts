//社員の一覧をinterfaceで側だけ用意しておく
//他のファイルからimportできるようにexportをつける
//interfaceの一文字目は大文字
export interface Member {
    id: number;
    name: string;
}