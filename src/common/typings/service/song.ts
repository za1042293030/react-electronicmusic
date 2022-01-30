import { ISongSimple } from '.';

interface ISong extends ISongSimple {
  describe?: string;
  createTime: string;
  commentCount: number;
}
export type { ISong };
