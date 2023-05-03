import React, { useState } from 'react';
import { Text, OuterBox, Button, Input } from '../Styles/BaseStyles';

interface Props {
  logIn: (email: string, password: string) => void;
}

export default function UserLogInView(props: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function logInAttempt() {
    props.logIn(email, password);
  }

  return (
    <OuterBox>
      <Text>
        <b>Welcome back!</b>
      </Text>
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
      <Button onClick={logInAttempt} type="button">
        Log In
      </Button>
      <Text></Text>
    </OuterBox>
  );
}
