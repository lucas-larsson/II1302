import React, { useState, useEffect } from 'react';
import { Text, OuterBox, Button, Input, ErrorText } from '../Styles/BaseStyles';

interface Props {
  signUp: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => void;
  errorMsg: string;
}

export default function UserSignUpView(props: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showErrorBox, setShowErrorBox] = useState<Boolean>(false);

  useEffect(() => {
    if (props.errorMsg !== '') {
      setShowErrorBox(true);
    } else {
      setShowErrorBox(false);
    }
  }, [props.errorMsg]);

  function signUpAttempt() {
    props.signUp(firstName, lastName, email, password);
  }

  return (
    <OuterBox>
      <Text>
        <b>Register now to start using the app!</b>
      </Text>

      {showErrorBox ? (
        <OuterBox>
          <ErrorText>{props.errorMsg}</ErrorText>{' '}
        </OuterBox>
      ) : null}

      <Input
        type="text"
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
        placeholder="First name"
        required
      />
      <Input
        type="text"
        value={lastName}
        onChange={e => setLastName(e.target.value)}
        placeholder="Last name"
        required
      />
      <Input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <Input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <Text></Text>
      <Button onClick={signUpAttempt} type="button">
        Sign Up
      </Button>
      <Text></Text>
    </OuterBox>
  );
}
