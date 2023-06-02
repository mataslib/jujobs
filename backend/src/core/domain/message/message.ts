import {withId} from '../../shared/utils';
import {MessageData} from './schema';

export class Message {
  private _data: MessageData;
  public get data() {
    return this._data;
  }

  private constructor(data: MessageData) {
    this._data = data;
  }

  public sentInfo(infoProps: any) {
    this._data = {
      ...this._data,
      ...infoProps,
    };
  }

  public feedback(data: any) {
    this._data = {
      ...this._data,
      feedback: data,
    };
  }

  public bounced() {}

  public static create(data: MessageData) {
    const message = new Message(withId(data));
    return message;
  }

  public static fromPersisted(data: MessageData) {
    return new Message(data);
  }
}
