import BaseValidator from './BaseValidator';

export default class extends BaseValidator {
  constructor(val) {
    super(val, 'パスワード', 'password');
    this._checkLength = this._checkLength.bind(this);
  }
  validate() {
    return super._cannotEmpty()
      .then(this._checkLength)
      .then(this._checkFormat)
      .then((res) => {
        return { success: true }; // Promise.resolve({ success: true })と同一
      })
      .catch(err => {
        return err; // Promise.resolve(err)と同一
      });
  }
  _checkLength() {
    if (this.val.length >= 8) {
      return Promise.resolve();
    } else {
      return Promise.reject({
        success: false,
        type: 'password',
        message: 'パスワードが短すぎます。'
      });
    }
  }
  _checkFormat() {
    const re = /^(?=.*[A-Z])(?=.*[_\.@\-])([a-zA-Z0-9_\.@\-]*)$/;
    const valid = re.test(this.val);

    if(valid) {//フォーマットが正しかったら
      console.log(Promise.resolve());
      return Promise.resolve()
    } else {//正しくなかったら
      console.log(Promise.reject());
      return Promise.reject({
        success: false,
        type: this.type,
        message: `${this.typeName}は半角英数字かつ必ず一文字以上の大文字と@_-.の記号を使用してください。`
      })
    }
  }

}