import { RuleObject } from 'antd/lib/form';
import { StoreValue } from 'antd/lib/form/interface';

type Validateor = (
  rule: RuleObject,
  value: StoreValue,
  callback: (error?: string) => void
) => Promise<void | any> | void;

export type { Validateor };
