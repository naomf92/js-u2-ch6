import MailValidator from './lib/MailValidator';
import PasswordValidator from './lib/PasswordValidator';
import NameValidator from './lib/NameValidator';
import UsernameValidator from './lib/UsernameValidator';
import 'whatwg-fetch'

const endpoint = "http://localhost:3000"

const validate = (params) => {
  const name = params.name;
  const email = params.email;
  const password = params.password;
  const username = params.username;
  const mailValidator = new MailValidator(email);
  const passwordValidator = new PasswordValidator(password);
  const nameValidator = new NameValidator(name)
  const usernameValidator = new UsernameValidator(username)
  return Promise.all([
    nameValidator.validate(),
    usernameValidator.validate(),
    mailValidator.validate(),
    passwordValidator.validate()]
  )
}

const removeErrors = () => {
  return new Promise((resolve) => {
    document.querySelectorAll('.is-invalid').forEach((el) => {
      el.classList.remove('is-invalid')
    })
    document.querySelectorAll('.invalid-feedback').forEach((el) => {
      el.parentNode.removeChild(el);
    })
    resolve();
  })
}

const addErrorMessage = (type, message) => {
  let input = document.getElementById(type);
  input.classList.add('is-invalid')
  input.insertAdjacentHTML('afterend', `<div class="invalid-feedback">${message}</div>`);
}

const signup = (params) => {
  return fetch(`${endpoint}/signup`, {
    method: 'POST',
    headers: {
      Accept: 'application/json; charset=utf-8',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: params.name,
      username: params.username,
      email: params.email,
      password: params.password
    })
  })
  .then((res) => {
    const json = res.json();
    if (res.status === 200) { // 登録成功
      return json
    } else { // 登録失敗
      return Promise.reject(new Error('ユーザー登録失敗'))
    }
  })
}

const onSubmit = async () => {
  let email = document.getElementById('email');
  let password = document.getElementById('password');
  let username = document.getElementById('username');
  let name = document.getElementById('name');
  let emailVal = email.value;
  let passwordVal = password.value;
  let usernameVal = username.value;
  let nameVal = name.value;
  await removeErrors()
  const params = {
    email: emailVal,//メールアドレスの値
    password: passwordVal,//パスワードの値
    username: usernameVal,//ユーザー名の値
    name: nameVal//名前の値
  }
  const results = await validate(params);
  if (results[0].success && results[1].success && results[2].success && results[3].success) {
    //バリデーション成功時 paramsの中身が要件を満たしていたら
    signup(params)
      .then((json) => {
        alert(json.message);
      })
      .catch((err) => {
        alert(err.message);
      });
  } else {//エラーメッセージを出力 バリテーション失敗 入力情報にミスがあったら
    results.forEach(result => {
      if(!result.success) {
        addErrorMessage(result.type, result.message);
      }
    });
  }
}

{
  const submit = document.getElementById('submit');
  submit.addEventListener('click', onSubmit);
}