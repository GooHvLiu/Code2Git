// 基础后端统一返回结构，泛型 T 代表内部data里的业务数据类型， T 就是泛型参数，相当于占位符，代表未来要传入的业务类型
export interface ResponseData<T> {
  code: number;
  message: string;
  ok: boolean;
  data: T; // T 暂时不知道是什么类型，调用的时候再告诉TS T是谁
}
