import { ISongSimple } from '.';

interface ISong extends ISongSimple {
  describe?: string;
  createTime: string;
  commentedCount: number;
}
export type { ISong };
