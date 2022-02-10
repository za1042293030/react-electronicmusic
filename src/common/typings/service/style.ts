interface IStyle {
  id: number;
  name: string;
  children: IStyle[];
}

interface IUserSimple {
  id: number;
  nickName: string;
}

interface ISongSimple {
  id: number;
  name: string;
  file: string;
  cover: string;
  styles: IStyle[];
  artists: {
    id: number;
    nickName: string;
  }[];
}

interface IPlayListSimple {
  id: number;
  name: string;
  createBy: IUserSimple;
  styles: IStyle[];
  cover: string | null;
  describe: string;
  playListPopVisible: boolean;
  isEditPlayListModalVisible: boolean;
}

export type { ISongSimple, IStyle, IUserSimple, IPlayListSimple };
