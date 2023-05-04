import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { OuterBox, Text } from "../Styles/BaseStyles";

export default function UserProfileView() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <OuterBox>
      {user ? (
        <>
          <Text>Name: {user.name}</Text>
          <Text>Surname: {user.surname}</Text>
          <Text>Email: {user.email}</Text>
          <Text>Person ID: {user.person_id}</Text>
        </>
      ) : (
        <Text>You have to log in to see this page.</Text>
      )}
    </OuterBox>
  );
}
