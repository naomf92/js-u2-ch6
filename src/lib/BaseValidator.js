export default class {
  constructor(val, typeName, type) {
    this.val = val;
    this.typeName = typeName;
    this.type = type;
    this.result = {};
    console.log(this.typeName);
    console.log(this.type);
  }
  _cannotEmpty() {
    return new Promise((resolve, reject) => {
      if (!!this.val) {
        resolve(this);
      } else {
        reject({
          success: false,
          message: `${this.typeName}は必須です。`,
          type: this.type
        })
      }
    });
  }
}